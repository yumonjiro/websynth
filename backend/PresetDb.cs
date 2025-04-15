using Microsoft.EntityFrameworkCore;


class PresetDb : DbContext
{
    public PresetDb(DbContextOptions<PresetDb> options)
            : base(options) { }

    public DbSet<Preset> Presets => Set<Preset>();

    //所有の設定
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //https://learn.microsoft.com/ja-jp/ef/core/modeling/owned-entities#nested-owned-types
        // https://github.com/dotnet/efcore/issues/12004
        base.OnModelCreating(modelBuilder);

        //    modelBuilder.Entity<Preset>()
        //    .OwnsOne( p => p.SynthSettings, synthSettingsBuilder => {
        //     synthSettingsBuilder.WithOwner(s => s.Preset);
        //     synthSettingsBuilder.OwnsMany(s => s.Oscillators, o => {
        //         o.WithOwner(o => o.SynthSettings);
        //     });

        //    });
        modelBuilder.Entity<Preset>(b =>
        {
            b.HasKey(p => p.Id);
            b.HasData(new
            {
                Id = 1,
                Name = "Init Lead",
                IsBuiltin = true,
            });
            b.OwnsOne(p => p.SynthSettings, synthSettingsBuilder =>
            {
                synthSettingsBuilder.WithOwner(s => s.Preset);

                synthSettingsBuilder.HasData(new
                {
                    PresetId = 1,
                    VoicingType = "poly",
                    FilterCutoff = 1000f,
                    FilterResonance = 0.6f,
                    FilterLFOAmount = 0.1f,
                    EnvAttack = 0.02f,
                    EnvDecay = 0.3f,
                    EnvSustain = 0.8f,
                    EnvRelease = 0.4f,
                    LFOFreq = 6.0f,
                    LfoType = "Square", // required
                    LfoEnvAmount = 0.2f,
                });

                synthSettingsBuilder.OwnsMany(s => s.Oscillators, o =>
                {
                    o.WithOwner(o => o.SynthSettings);
                    o.HasData(new[] {
                        new
                        {
                            SynthSettingsPresetId = 1,
                            Id = 1, // ★ OscillatorSettings の主キー (HasKeyで指定した場合)
                            Enabled = true,
                            OscillatorType = "Sawtooth", // required
                            Gain = 0.85f,
                            Detune = 0f,
                            OctaveOffset = 0,
                        },
                        new
                        {
                            SynthSettingsPresetId = 1,
                            Id = 2, // ★ OscillatorSettings の主キー (HasKeyで指定した場合)
                            Enabled = true,
                            OscillatorType = "Pulse", // required
                            Gain = 0.85f,
                            Detune = 1.5f,
                            OctaveOffset = 0,
                        }
                    });
                });
            });

        });




    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.EnableSensitiveDataLogging();
    }
}