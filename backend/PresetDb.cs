using Microsoft.EntityFrameworkCore;

class PresetDb : DbContext {
    public PresetDb(DbContextOptions<PresetDb> options)
        : base(options) { }

    public DbSet<Preset> Presets => Set<Preset>();
}