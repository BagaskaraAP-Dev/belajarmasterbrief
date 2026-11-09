<?php

declare(strict_types=1);

$startTime = microtime(true);

$dbHost = getenv('DB_HOST') ?: 'db';
$dbPort = getenv('DB_PORT') ?: '5432';
$dbName = getenv('DB_DATABASE') ?: 'enterprise_db';
$dbUser = getenv('DB_USERNAME') ?: 'bagas';
$dbPass = getenv('DB_PASSWORD') ?: 'secretpassword';

$redisHost = getenv('REDIS_HOST') ?: 'redis';
$redisPort = (int)(getenv('REDIS_PORT') ?: 6379);

$dbStatus = false;
$dbError = null;
$logs = [];

try {
    $dsn = "pgsql:host={$dbHost};port={$dbPort};dbname={$dbName};";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 3,
    ]);

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS audit_logs (
            id SERIAL PRIMARY KEY,
            ip_address VARCHAR(45),
            user_agent TEXT,
            visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ");

    $stmt = $pdo->prepare("INSERT INTO audit_logs (ip_address, user_agent) VALUES (:ip, :ua)");
    $stmt->execute([
        ':ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
        ':ua' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
    ]);

    $logs = $pdo->query("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 5")->fetchAll();
    $dbStatus = true;
} catch (Throwable $e) {
    $dbError = $e->getMessage();
}

$redisStatus = false;
$redisError = null;
$visitCount = 0;

try {
    if (class_exists('Redis')) {
        $redis = new Redis();
        $connected = $redis->connect($redisHost, $redisPort, 2.5);
        if ($connected) {
            $redisStatus = true;
            $visitCount = $redis->incr('stats:page_views');
            $redis->set('system:last_ping', date('Y-m-d H:i:s'), 300);
        }
    } else {
        $redisError = 'Ekstensi Redis PHP belum terpasang di container.';
    }
} catch (Throwable $e) {
    $redisError = $e->getMessage();
}

$executionTime = round((microtime(true) - $startTime) * 1000, 2);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise PHP Audit Dashboard</title>
    <style>
        :root {
            --bg: #0a0e14;
            --surface: #111827;
            --surface-elevated: #1e293b;
            --border: #334155;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --status-ok: #10b981;
            --status-err: #ef4444;
            --accent-code: #38bdf8;
            --focus-ring: #60a5fa;
            --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg);
            color: var(--text-primary);
            font-family: var(--font-sans);
            padding: 2.5rem 1.25rem;
            min-height: 100vh;
            line-height: 1.5;
        }

        .container {
            max-width: 960px;
            margin: 0 auto;
        }

        header {
            margin-bottom: 2rem;
            border-bottom: 1px solid var(--border);
            padding-bottom: 1.5rem;
        }

        h1 {
            font-size: 1.875rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: var(--text-primary);
        }

        p.subtitle {
            color: var(--text-secondary);
            font-size: 0.95rem;
            margin-top: 0.35rem;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 1.25rem;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }

        .card-title {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.15rem 0.5rem;
            border-radius: 4px;
        }

        .status-badge.ok {
            background: rgba(16, 185, 129, 0.15);
            color: var(--status-ok);
            border: 1px solid var(--status-ok);
        }

        .status-badge.err {
            background: rgba(239, 68, 68, 0.15);
            color: var(--status-err);
            border: 1px solid var(--status-err);
        }

        .card-value {
            font-size: 1.35rem;
            font-weight: 700;
            color: var(--text-primary);
            font-family: var(--font-mono);
        }

        .card-meta {
            margin-top: 0.35rem;
            font-size: 0.8rem;
            color: var(--text-secondary);
            font-family: var(--font-mono);
            word-break: break-all;
        }

        .panel {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }

        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 1rem;
        }

        .panel-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .panel-subtitle {
            font-size: 0.8rem;
            color: var(--text-secondary);
            font-family: var(--font-mono);
        }

        .table-responsive {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;
        }

        th, td {
            text-align: left;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--border);
        }

        th {
            background: var(--surface-elevated);
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        td {
            color: var(--text-primary);
            font-family: var(--font-mono);
            font-size: 0.825rem;
        }

        .ua-cell {
            font-family: var(--font-sans);
            max-width: 340px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--text-secondary);
        }

        .code-box {
            background: #05070a;
            border: 1px solid var(--border);
            padding: 1.25rem;
            border-radius: 6px;
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--accent-code);
            overflow-x: auto;
            line-height: 1.6;
        }

        :focus-visible {
            outline: 2px solid var(--focus-ring);
            outline-offset: 2px;
        }

        footer {
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.85rem;
            margin-top: 3rem;
            font-family: var(--font-mono);
        }
    </style>
</head>
<body>
    <main class="container">
        <header>
            <h1>Telemetry &amp; Audit Log Monitor</h1>
            <p class="subtitle">Arsitektur multi-container: Nginx 1.27 &bull; PHP 8.3-FPM &bull; PostgreSQL 16 &bull; Redis 7</p>
        </header>

        <section class="grid" aria-label="Status Komponen Sistem">
            <article class="card">
                <div class="card-header">
                    <span class="card-title">Reverse Proxy</span>
                    <span class="status-badge ok">ACTIVE</span>
                </div>
                <div class="card-value">Nginx 1.27</div>
                <div class="card-meta">Routing: :8080 &rarr; :80</div>
            </article>

            <article class="card">
                <div class="card-header">
                    <span class="card-title">PHP Runtime</span>
                    <span class="status-badge ok">READY</span>
                </div>
                <div class="card-value">PHP <?= PHP_VERSION ?></div>
                <div class="card-meta">FastCGI: <?= $executionTime ?> ms</div>
            </article>

            <article class="card">
                <div class="card-header">
                    <span class="card-title">Database</span>
                    <span class="status-badge <?= $dbStatus ? 'ok' : 'err' ?>"><?= $dbStatus ? 'CONNECTED' : 'DISCONNECTED' ?></span>
                </div>
                <div class="card-value"><?= $dbStatus ? 'PostgreSQL 16' : 'Offline' ?></div>
                <div class="card-meta"><?= $dbStatus ? "Schema: {$dbName}" : htmlspecialchars($dbError ?? '') ?></div>
            </article>

            <article class="card">
                <div class="card-header">
                    <span class="card-title">Cache Layer</span>
                    <span class="status-badge <?= $redisStatus ? 'ok' : 'err' ?>"><?= $redisStatus ? 'ONLINE' : 'OFFLINE' ?></span>
                </div>
                <div class="card-value"><?= $redisStatus ? "{$visitCount} hits" : 'Offline' ?></div>
                <div class="card-meta"><?= $redisStatus ? 'Atomic In-Memory' : htmlspecialchars($redisError ?? '') ?></div>
            </article>
        </section>

        <section class="panel" aria-label="Tabel Audit Log Kunjungan">
            <div class="panel-header">
                <h2 class="panel-title">PostgreSQL Audit Trail</h2>
                <span class="panel-subtitle">Tabel: audit_logs (5 entri terakhir)</span>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th scope="col" style="width: 70px;">ID</th>
                            <th scope="col" style="width: 150px;">IP Address</th>
                            <th scope="col">User Agent</th>
                            <th scope="col" style="width: 200px;">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (!empty($logs)): ?>
                            <?php foreach ($logs as $log): ?>
                                <tr>
                                    <td>#<?= (int)$log['id'] ?></td>
                                    <td><?= htmlspecialchars($log['ip_address']) ?></td>
                                    <td class="ua-cell" title="<?= htmlspecialchars($log['user_agent']) ?>">
                                        <?= htmlspecialchars($log['user_agent']) ?>
                                    </td>
                                    <td><?= htmlspecialchars($log['visited_at']) ?></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                                    Tidak ada data audit yang tercatat.
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="panel" aria-label="Alur Komunikasi Docker Compose">
            <div class="panel-header">
                <h2 class="panel-title">Alur Data Internal Container</h2>
                <span class="panel-subtitle">Bridge Network: enterprise_net</span>
            </div>
            <pre class="code-box"><code>[Host: Port 8080]
  &boxdr;&boxh;&boxh; Nginx (web:80)
        &boxur;&boxh;&boxh; fastcgi_pass app:9000
              &boxdr;&boxh;&boxh; PHP-FPM (app:9000)
                    &boxvr;&boxh;&boxh; PDO pgsql &boxh;&boxh;&gt; PostgreSQL (db:5432) [Volume: postgres_data]
                    &boxur;&boxh;&boxh; Ext-Redis  &boxh;&boxh;&gt; Redis (redis:6379)      [Volume: redis_data]</code></pre>
        </section>

        <footer>
            Node: <?= htmlspecialchars(gethostname()) ?> &bull; Lingkungan Terisolasi Docker Compose
        </footer>
    </main>
</body>
</html>
