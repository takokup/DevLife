using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DevLife.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DatingSetups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Gender = table.Column<string>(type: "text", nullable: false),
                    LookingFor = table.Column<string>(type: "text", nullable: false),
                    Bio = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatingSetups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DatingSwipes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ProfileId = table.Column<string>(type: "text", nullable: false),
                    Liked = table.Column<bool>(type: "boolean", nullable: false),
                    IsMatch = table.Column<bool>(type: "boolean", nullable: false),
                    MatchAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatingSwipes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DatingSetups_UserId",
                table: "DatingSetups",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DatingSwipes_UserId_ProfileId",
                table: "DatingSwipes",
                columns: new[] { "UserId", "ProfileId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DatingSetups");

            migrationBuilder.DropTable(
                name: "DatingSwipes");
        }
    }
}
