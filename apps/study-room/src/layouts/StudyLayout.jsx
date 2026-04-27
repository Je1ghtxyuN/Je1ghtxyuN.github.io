function StudyLayoutZone({ area, children }) {
  if (!children) return null

  return (
    <section
      className={`study-layout__zone study-layout__zone--${area}`}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </section>
  )
}

export function StudyLayout({
  variant = 'idle',
  chrome,
  center,
  footer,
  onSceneClick,
}) {
  return (
    <main className={`study-layout study-layout--${variant}`}>
      {variant === 'focus' && onSceneClick ? (
        <button
          type="button"
          className="study-layout__scene-hit-area"
          aria-label="Return to idle mode"
          onClick={onSceneClick}
        />
      ) : null}

      <StudyLayoutZone area="chrome">{chrome}</StudyLayoutZone>
      <StudyLayoutZone area="center">{center}</StudyLayoutZone>
      <StudyLayoutZone area="footer">{footer}</StudyLayoutZone>
    </main>
  )
}
