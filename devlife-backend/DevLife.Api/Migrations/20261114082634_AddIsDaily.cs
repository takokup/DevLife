using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevLife.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDaily : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDaily",
                table: "GameRounds",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDaily",
                table: "GameRounds");
        }
    }
}
