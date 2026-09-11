using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KarnelTravelAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddRestaurantSeatAvailability : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AvailableSeats",
                table: "restaurants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalSeats",
                table: "restaurants",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableSeats",
                table: "restaurants");

            migrationBuilder.DropColumn(
                name: "TotalSeats",
                table: "restaurants");
        }
    }
}
