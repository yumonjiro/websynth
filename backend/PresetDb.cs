using Microsoft.EntityFrameworkCore;


class PresetDb : DbContext {
    public PresetDb(DbContextOptions<PresetDb> options)
        : base(options) { }

    public DbSet<Preset> Presets => Set<Preset>();

    //所有の設定
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Preset>().
            // SynthSettings が Preset に所有されることを定義 (OwnsOne)
            OwnsOne(p => p.SynthSettings, synthSettingsBuilder => // synthSettingsBuilder という変数名に変更（任意）
            {
                // SynthSettings 内の OscillatorSettings コレクションも所有されることを定義 (OwnsMany)
                synthSettingsBuilder.OwnsMany(s => s.Oscillators, o => {
                    o.WithOwner().HasForeignKey("PresetId");
                });
            });
    }
}