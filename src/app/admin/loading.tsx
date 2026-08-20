import styles from './admin.module.css'

// Mirrors the dashboard shell rather than showing a spinner: the static chrome
// is real, and only the parts that wait on DynamoDB are placeholders, so the
// page does not visibly rebuild itself once the data lands.
const ROWS = 6

function Block({
  width,
  height,
  onDark,
}: {
  width: number | string
  height: number
  onDark?: boolean
}) {
  return (
    <span
      className={[styles.skeleton, onDark ? styles.skeletonOnDark : '']
        .filter(Boolean)
        .join(' ')}
      style={{ width, height }}
    />
  )
}

function TelegramMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.8 3.6 18.7 19c-.2 1.1-.9 1.4-1.8.9l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.8-8c.4-.3-.1-.5-.6-.2L6.5 13 1.8 11.5c-1-.3-1-1 .2-1.5L20.4 3c.9-.3 1.6.2 1.4.6Z" />
    </svg>
  )
}

export default function AdminLoading() {
  return (
    <main className={styles.dashboard} aria-busy="true">
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>
              <TelegramMark />
            </span>
            <span>
              <strong>Control room</strong>
              <small>Telegram agent</small>
            </span>
          </div>
          <div className={styles.ownerMenu}>
            <Block width={34} height={34} onDark />
            <Block width={120} height={30} onDark />
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>Live configuration</p>
            <h1>Chats</h1>
            <p>Control the outer AI allowlist and each chat&apos;s agent switch.</p>
          </div>
        </section>

        <dl className={styles.metrics}>
          {['Known chats', 'AI allowed', 'Agent active'].map((label) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                <Block width={56} height={30} />
              </dd>
              <Block width={110} height={11} />
            </div>
          ))}
        </dl>

        <section className={styles.directory} aria-labelledby="chat-directory">
          <div className={styles.directoryHeader}>
            <div>
              <h2 id="chat-directory">Chat directory</h2>
              <Block width={150} height={12} />
            </div>
            <div className={styles.controls}>
              <Block width={230} height={38} />
              <Block width={150} height={38} />
            </div>
          </div>

          <div className={styles.tableHeader}>
            <span>Chat</span>
            <span>Last active</span>
            <span>AI access</span>
            <span>Agent</span>
          </div>

          <div className={styles.chatList}>
            {Array.from({ length: ROWS }, (_, index) => (
              <article className={styles.chatRow} key={index}>
                <div className={styles.chatIdentity}>
                  <Block width={39} height={39} />
                  <span className={styles.chatDetails}>
                    <Block width="min(190px, 70%)" height={13} />
                    <Block width="min(120px, 50%)" height={11} />
                  </span>
                </div>
                <div className={styles.activityCell}>
                  <Block width="min(130px, 80%)" height={13} />
                </div>
                <div className={styles.flagCell}>
                  <Block width={92} height={24} />
                </div>
                <div className={styles.flagCell}>
                  <Block width={92} height={24} />
                </div>
              </article>
            ))}
          </div>

          <footer className={styles.pagination}>
            <Block width={90} height={38} />
            <Block width={110} height={12} />
            <Block width={170} height={38} />
          </footer>
        </section>
      </div>
    </main>
  )
}
