
using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace KarnelTravelAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddRestaurantRatings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "restaurant_ratings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation(
                            "MySQL:ValueGenerationStrategy",
                            MySQLValueGenerationStrategy.IdentityColumn),

                    RestaurantId = table.Column<int>(
                        type: "int",
                        nullable: false),

                    UserId = table.Column<int>(
                        type: "int",
                        nullable: false),

                    Rating = table.Column<int>(
                        type: "int",
                        nullable: false),

                    UserName = table.Column<string>(
                        type: "longtext",
                        nullable: true),

                    CreatedAt = table.Column<DateTime>(
                        type: "datetime(6)",
                        nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey(
                        "PK_restaurant_ratings",
                        x => x.Id);

                    table.ForeignKey(
                        name: "FK_restaurant_ratings_restaurants_RestaurantId",
                        column: x => x.RestaurantId,
                        principalTable: "restaurants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);

                    table.ForeignKey(
                        name: "FK_restaurant_ratings_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_restaurant_ratings_RestaurantId_UserId",
                table: "restaurant_ratings",
                columns: new[] { "RestaurantId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_restaurant_ratings_UserId",
                table: "restaurant_ratings",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "restaurant_ratings");
        }
    }
}

