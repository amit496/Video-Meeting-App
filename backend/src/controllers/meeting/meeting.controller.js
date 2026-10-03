import prisma from "../../lib/prisma.js";

const generateRoomId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
};

export const createMeeting = async (req, res) => {
  try {
    const userId = req.user.id;

    let roomId;
    let existingMeeting;

    do {
      roomId = generateRoomId();

      existingMeeting = await prisma.meeting.findUnique({
        where: {
          roomId,
        },
      });
    } while (existingMeeting);

    const meeting = await prisma.meeting.create({
      data: {
        roomId,
        hostId: userId,
        participants: {
          create: {
            userId,
          },
        },
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: meeting,
    });
  } catch (error) {
    console.error("Create meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create meeting",
    });
  }
};

export const joinMeeting = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.body;

    const meeting = await prisma.meeting.findUnique({
      where: {
        roomId,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    const existingParticipant = await prisma.participant.findUnique({
      where: {
        userId_meetingId: {
          userId,
          meetingId: meeting.id,
        },
      },
    });

    if (!existingParticipant) {
      await prisma.participant.create({
        data: {
          userId,
          meetingId: meeting.id,
        },
      });
    }

    const updatedMeeting = await prisma.meeting.findUnique({
      where: {
        id: meeting.id,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Joined meeting successfully",
      data: updatedMeeting,
    });
  } catch (error) {
    console.error("Join meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to join meeting",
    });
  }
};