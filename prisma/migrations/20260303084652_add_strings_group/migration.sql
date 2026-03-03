-- CreateTable
CREATE TABLE "StringsGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupName" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "stencilText" TEXT NOT NULL,
    "tennisMains" TEXT NOT NULL,
    "tennisCrosses" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
