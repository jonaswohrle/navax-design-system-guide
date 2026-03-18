function Swatch({
  name,
  className,
  textClassName,
  value,
}: {
  name: string
  className: string
  textClassName: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`h-20 w-full rounded-lg border border-border ${className}`}
      />
      <div>
        <p className={`text-sm font-medium ${textClassName}`}>{name}</p>
        <p className="text-xs text-muted-foreground">{value}</p>
      </div>
    </div>
  )
}

export function ShowcaseColors() {
  return (
    <div className="flex flex-col gap-8">
      {/* Core palette */}
      <div>
        <p className="text-sm font-medium mb-3 text-foreground">Core Brightly Palette</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          <Swatch
            name="Green"
            className="bg-primary"
            textClassName="text-foreground"
            value="#00C9A7"
          />
          <Swatch
            name="Navy"
            className="bg-foreground"
            textClassName="text-foreground"
            value="#0C2340"
          />
          <Swatch
            name="Info Blue"
            className="bg-info"
            textClassName="text-foreground"
            value="#0C3D6E"
          />
          <Swatch
            name="Background"
            className="bg-background"
            textClassName="text-foreground"
            value="#FFFFFF"
          />
          <Swatch
            name="Secondary"
            className="bg-secondary"
            textClassName="text-foreground"
            value="#F5F7FA"
          />
        </div>
      </div>

      {/* Semantic colors */}
      <div>
        <p className="text-sm font-medium mb-3 text-foreground">Semantic Colors</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          <Swatch
            name="Accent"
            className="bg-accent"
            textClassName="text-foreground"
            value="Green tint"
          />
          <Swatch
            name="Muted"
            className="bg-muted"
            textClassName="text-foreground"
            value="Cool gray"
          />
          <Swatch
            name="Destructive"
            className="bg-destructive"
            textClassName="text-foreground"
            value="#E53935"
          />
          <Swatch
            name="Success"
            className="bg-success"
            textClassName="text-foreground"
            value="#1A9A5C"
          />
          <Swatch
            name="Warning"
            className="bg-warning"
            textClassName="text-foreground"
            value="#E99200"
          />
        </div>
      </div>
    </div>
  )
}
