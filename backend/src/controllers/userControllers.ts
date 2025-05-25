import { Request, Response } from "express"
import * as userServices from "../services/userServices"
import { ApiResponse, Friendship, User } from "../libs/interfaces"

export const sendFriendRequest = async (req: Request, res: Response) => {
  const requesterId = req.user?.id
  const { username } = req.body

  if (!username) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "Username is required",
    } as ApiResponse<null>)
    return
  }

  if (!requesterId) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "Requester ID is required",
    } as ApiResponse<null>)
    return
  }

  if (req.user?.username === username) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "You cannot send a friend request to yourself",
    } as ApiResponse<null>)
    return
  }

  try {
    const friendship = await userServices.addFriend(requesterId, username)

    if (!friendship) {
      res.status(400).json({
        status: 400,
        message: "Add friend failed",
        error: "Friendship already exists or user not found",
      } as ApiResponse<null>)
    }

    res.status(200).json({
      status: 200,
      message: "Friend request sent successfully",
      data: friendship,
    } as ApiResponse<Friendship>)
    return
  } catch (error) {
    console.log("Error sending friend request:", error)
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Something went wrong while sending friend request",
    })
    return
  }
}

export const acceptFriendRequest = async (req: Request, res: Response) => {
  const userId = req.user?.id
  const { requesterId } = req.body

  if (!requesterId) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "Requester ID is required",
    } as ApiResponse<null>)
    return
  }

  if (!userId) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "User ID is required",
    } as ApiResponse<null>)
    return
  }

  const requesterIdNum =
    typeof requesterId === "string" ? parseInt(requesterId) : requesterId

  try {
    const friendship = await userServices.acceptFriendRequest(
      userId,
      requesterIdNum
    )

    if (!friendship) {
      res.status(400).json({
        status: 400,
        message: "Bad request",
        error: "Failed to accept friend request",
      } as ApiResponse<null>)
      return
    }

    res.status(200).json({
      status: 200,
      message: "Friend request accepted successfully",
      data: friendship,
    } as ApiResponse<Friendship>)
    return
  } catch (error) {
    console.log("Error accepting friend request:", error)
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Something went wrong while accepting friend request",
    } as ApiResponse<null>)
    return
  }
}

export const rejectFriendRequest = async (req: Request, res: Response) => {
  const userId = req.user?.id
  const { requesterId } = req.body

  if (!requesterId) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "Requester ID is required",
    } as ApiResponse<null>)
    return
  }

  if (!userId) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "User ID is required",
    } as ApiResponse<null>)
    return
  }

  const requesterIdNum =
    typeof requesterId === "string" ? parseInt(requesterId) : requesterId

  try {
    const friendship = await userServices.rejectFriendRequest(
      userId,
      requesterIdNum
    )

    if (!friendship) {
      res.status(400).json({
        status: 400,
        message: "Bad request",
        error: "Failed to reject friend request",
      } as ApiResponse<null>)
      return
    }

    res.status(200).json({
      status: 200,
      message: "Friend request rejected successfully",
      data: friendship,
    } as ApiResponse<Friendship>)
    return
  } catch (error) {
    console.log("Error rejecting friend request:", error)
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Something went wrong while rejecting friend request",
    } as ApiResponse<null>)
    return
  }
}

export const getFriends = async (req: Request, res: Response) => {
  const userId = req.user?.id
  if (!userId) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "User ID is required",
    } as ApiResponse<null>)
    return
  }

  try {
    const friends = await userServices.getFriends(userId)
    if (!friends) {
      res.status(400).json({
        status: 400,
        message: "Bad request",
        error: "Failed to get friends",
      } as ApiResponse<null>)
      return
    }

    res.status(200).json({
      status: 200,
      message: "Get friends successfully",
      data: friends,
    } as ApiResponse<User[]>)
    return
  } catch (error) {
    console.log("Error getting friends:", error)
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Something went wrong while getting friends",
    } as ApiResponse<null>)
    return
  }
}

export const getPendingFriendRequests = async (req: Request, res: Response) => {
  const userId = req.user?.id
  if (!userId) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "User ID is required",
    } as ApiResponse<null>)
    return
  }

  try {
    const penddingRequests = await userServices.getPendingFriendRequests(userId)
    if (!penddingRequests) {
      res.status(400).json({
        status: 400,
        message: "Bad request",
        error: "Failed to get pending friend requests",
      } as ApiResponse<null>)
      return
    }

    res.status(200).json({
      status: 200,
      message: "Get pending friend requests successfully",
      data: penddingRequests,
    } as ApiResponse<typeof penddingRequests>)
    return
  } catch (error) {
    console.log("Error getting pending friend requests:", error)
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Something went wrong while getting pending friend requests",
    } as ApiResponse<null>)
    return
  }
}
