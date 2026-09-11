using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KarnelTravelAPI.Migrations
{
    /// <inheritdoc />
    public partial class MakeHotelRatingUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "hotel_ratings",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_hotel_ratings_UserId",
                table: "hotel_ratings",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_hotel_ratings_users_UserId",
                table: "hotel_ratings",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_hotel_ratings_users_UserId",
                table: "hotel_ratings");

            migrationBuilder.DropIndex(
                name: "IX_hotel_ratings_UserId",
                table: "hotel_ratings");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "hotel_ratings",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
