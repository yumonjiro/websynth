using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins"; // ポリシー名を定義 (任意)

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          // 許可したいフロントエンドのオリジンを指定
                          policy.AllowAnyOrigin()
                                // 許可するHTTPメソッドを指定 (GET, POST, PUT, DELETEなど)
                                // AllowAnyMethod() は全てのメソッドを許可 (開発中は便利)
                                .AllowAnyMethod()
                                // 許可するHTTPヘッダーを指定 (Content-Type, Authorizationなど)
                                // AllowAnyHeader() は全てのヘッダーを許可 (開発中は便利)
                                .AllowAnyHeader();
                          // もしフロントエンドからCookieや認証情報(Authorizationヘッダー以外)を送る場合は以下も必要
                          // .AllowCredentials();
                          // 注意: AllowCredentials() を使う場合、WithOrigins("*") は使えません。
                      });
    // 本番環境用に異なるポリシーを定義することもできます
    // options.AddPolicy("ProductionPolicy", policy => { ... });
});
// --- CORS設定ここまで ---

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
app.MapGet("/presets/{id}", async (int id, PresetDb db) => 
    await db.Presets.FindAsync(id)
        is Preset preset ? Results.Ok(preset)
        : Results.NotFound());
app.MapGet("/", () => "Hello World!");

app.MapPost("/presets", async (Preset preset, PresetDb db) => {
    db.Presets.Add(preset);
    await db.SaveChangesAsync();

    return Results.Created($"presets/{preset.Id}", preset);
});

app.UseCors(MyAllowSpecificOrigins);
app.Run();
