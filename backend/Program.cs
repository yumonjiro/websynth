using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PresetDb>((opt) => opt.UseInMemoryDatabase("Presets"));
// builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config => {
    config.DocumentName= "WebSynthApi";
    config.Version = "v1";
    config.Title = "WebSynth v1";
});

var app = builder.Build();
if(app.Environment.IsDevelopment()) {
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

app.MapGet("/", () => "Hello World!");

app.MapPost("/presets", async (Preset preset, PresetDb db) => {
    db.Presets.Add(preset);
    await db.SaveChangesAsync();

    return Results.Created($"presets/{preset.Id}", preset);
});

app.Run();
