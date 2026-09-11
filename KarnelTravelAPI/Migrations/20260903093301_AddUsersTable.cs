using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace KarnelTravelAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddUsersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<int>(
                        type: "int",
                        nullable: false
                    )
                    .Annotation(
                        "MySQL:ValueGenerationStrategy",
                        MySQLValueGenerationStrategy.IdentityColumn
                    ),

                    Name = table.Column<string>(
                        type: "longtext",
                        nullable: false
                    ),

                    Email = table.Column<string>(
                        type: "longtext",
                        nullable: false
                    ),

                    PasswordHash = table.Column<string>(
                        type: "longtext",
                        nullable: false
                    )
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "users");
        }
    }
}