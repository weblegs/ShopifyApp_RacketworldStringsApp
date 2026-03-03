-- CreateTable
CREATE TABLE "StringsGroup" (
    "id" SERIAL NOT NULL,
    "groupName" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "stencilText" TEXT NOT NULL,
    "tennisMains" TEXT NOT NULL,
    "tennisCrosses" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StringsGroup_pkey" PRIMARY KEY ("id")
);
