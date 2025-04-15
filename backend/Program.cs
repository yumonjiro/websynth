using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins"; // ポリシー名を定義 (任意)

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.AllowAnyOrigin()
                                .AllowAnyMethod()
                                .AllowAnyHeader();
                      });
});

builder.Services.AddDbContext<PresetDb>((opt) => opt.UseInMemoryDatabase("Presets"));
// builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "WebSynthApi";
    config.Version = "v1";
    config.Title = "WebSynth v1";
});
builder.Services.AddSwaggerGen();
var app = builder.Build();

var scope = app.Services.CreateScope();
var created = scope.ServiceProvider.GetRequiredService<PresetDb>().Database.EnsureCreated();
Console.WriteLine($"Database Created: {created}");
if (app.Environment.IsDevelopment())
{

    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "WebSynthAPI";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}

app.MapGet("/presets", async (PresetDb db) =>
    await db.Presets.ToListAsync());
app.MapGet("/presets/{id}", async (int id, PresetDb db) =>
    await db.Presets.FindAsync(id)
        is Preset preset ? Results.Ok(preset)
        : Results.NotFound());
app.MapGet("/", () => "Hello World!");

app.MapPost("/presets", async (Preset preset, PresetDb db) =>
{
    db.Presets.Add(preset);
    await db.SaveChangesAsync();
    return Results.Created($"presets/{preset.Id}", preset);
});

app.MapDelete("/presets/{id}", async (int id, PresetDb db) => {
    Console.WriteLine($"delete request received. Preset id:{id}");
    if(await db.Presets.FindAsync(id) is Preset preset && !preset.IsBuiltin) {
        db.Presets.Remove(preset);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
});

app.UseCors(MyAllowSpecificOrigins);
app.Run();
