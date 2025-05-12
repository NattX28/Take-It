-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "hash_password" VARCHAR(255) NOT NULL,
    "profile_picture" VARCHAR(255) DEFAULT 'default.jpg',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "gallery_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "caption" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_public" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("gallery_id")
);

-- CreateTable
CREATE TABLE "GalleryShare" (
    "gallery_share_id" SERIAL NOT NULL,
    "gallery_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "shared_with_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryShare_pkey" PRIMARY KEY ("gallery_share_id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "friendship_id" SERIAL NOT NULL,
    "user_id_1" INTEGER NOT NULL,
    "user_id_2" INTEGER NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("friendship_id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "chat_room_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("chat_room_id")
);

-- CreateTable
CREATE TABLE "ChatRoomParticipant" (
    "chat_room_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatRoomParticipant_pkey" PRIMARY KEY ("chat_room_id","user_id")
);

-- CreateTable
CREATE TABLE "Message" (
    "message_id" SERIAL NOT NULL,
    "chat_room_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "reference_id" INTEGER,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryShare_gallery_id_shared_with_id_key" ON "GalleryShare"("gallery_id", "shared_with_id");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_user_id_1_user_id_2_key" ON "Friendship"("user_id_1", "user_id_2");

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryShare" ADD CONSTRAINT "GalleryShare_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "Gallery"("gallery_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryShare" ADD CONSTRAINT "GalleryShare_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryShare" ADD CONSTRAINT "GalleryShare_shared_with_id_fkey" FOREIGN KEY ("shared_with_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user_id_1_fkey" FOREIGN KEY ("user_id_1") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user_id_2_fkey" FOREIGN KEY ("user_id_2") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoomParticipant" ADD CONSTRAINT "ChatRoomParticipant_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "ChatRoom"("chat_room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoomParticipant" ADD CONSTRAINT "ChatRoomParticipant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "ChatRoom"("chat_room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
