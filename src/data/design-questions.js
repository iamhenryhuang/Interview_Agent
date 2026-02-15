/**
 * system-design-questions.js — 精選 System Design 面試題庫
 * 本地題庫，不需 API 呼叫即可取得題目
 */

const systemDesignQuestions = [
    {
        id: 'sd01',
        title: 'Design a URL Shortener',
        difficulty: 'medium',
        description:
            'Design a URL shortening service like TinyURL or bit.ly.\n\n**Functional Requirements:**\n- Given a long URL, generate a shorter, unique alias\n- When users access the short link, redirect to the original URL\n- Users can optionally specify a custom short link\n- Links expire after a configurable time span\n\n**Non-functional Requirements:**\n- The system should be highly available\n- URL redirection should happen in real-time with minimal latency\n- Shortened links should not be predictable',
        requirements: [
            'API Design: shorten(longUrl) → shortUrl, redirect(shortUrl) → longUrl',
            'Database schema for URL mappings',
            'Unique ID generation strategy (base62 encoding, hash collision handling)',
            'Read-heavy system — consider caching',
            'Analytics: click count, geographic data',
        ],
        evaluationDimensions: {
            apiDesign: 'Clear REST API with proper HTTP methods and status codes',
            dataModel: 'Efficient schema: URL mapping table, user table, analytics table',
            scalability: 'Horizontal scaling, database sharding by hash prefix',
            caching: 'Cache layer (Redis) for hot URLs, cache invalidation strategy',
            uniqueId: 'Base62 encoding, counter-based or hash-based approach, collision handling',
        },
    },
    {
        id: 'sd02',
        title: 'Design Twitter / Social Feed',
        difficulty: 'hard',
        description:
            'Design a social media platform like Twitter with a focus on the news feed feature.\n\n**Functional Requirements:**\n- Users can post tweets (280 chars)\n- Users can follow/unfollow other users\n- Users see a home timeline (feed) of tweets from people they follow\n- Tweet search functionality\n\n**Scale:**\n- 300M monthly active users\n- 600 tweets/second on average',
        requirements: [
            'Fan-out on write vs. fan-out on read tradeoffs',
            'Timeline generation and caching strategy',
            'Data storage: tweets, users, followership, timelines',
            'Search indexing with inverted index',
            'Media storage for images/videos',
        ],
        evaluationDimensions: {
            apiDesign: 'RESTful APIs for tweet CRUD, follow system, timeline retrieval',
            dataModel: 'Tweet table, User table, Follow table, Timeline cache',
            scalability: 'Fan-out strategies, hybrid approach for celebrities vs. normal users',
            caching: 'Timeline caching, tweet caching, celebrity handling',
            tradeoffs: 'Fan-out on write vs. read, consistency vs. availability',
        },
    },
    {
        id: 'sd03',
        title: 'Design a Chat System (WhatsApp / Messenger)',
        difficulty: 'hard',
        description:
            'Design a real-time chat application supporting one-on-one and group messaging.\n\n**Functional Requirements:**\n- 1-on-1 chat and group chat (up to 500 members)\n- Online/offline status indicators\n- Message delivery status (sent, delivered, read)\n- Push notifications for offline users\n- Chat history persistence\n\n**Non-functional:**\n- Low latency message delivery\n- High availability\n- End-to-end encryption',
        requirements: [
            'WebSocket vs. long polling for real-time communication',
            'Message queue for reliable delivery',
            'Chat server architecture and session management',
            'Message storage and retrieval',
            'Presence system for online status',
        ],
        evaluationDimensions: {
            apiDesign: 'WebSocket protocol design, REST for non-realtime operations',
            dataModel: 'Message table with partitioning, conversation metadata, user sessions',
            scalability: 'Chat server scaling, connection management, message queues',
            reliability: 'Message ordering, delivery guarantees, offline message handling',
            tradeoffs: 'WebSocket vs. SSE vs. polling, push vs. pull for notifications',
        },
    },
    {
        id: 'sd04',
        title: 'Design a Rate Limiter',
        difficulty: 'medium',
        description:
            'Design a rate limiter that controls the rate of requests a client can send to an API.\n\n**Functional Requirements:**\n- Limit requests per client per time window\n- Support different rate limiting rules (per user, per IP, per API endpoint)\n- Return proper HTTP status (429 Too Many Requests) when limit exceeded\n- Distributed rate limiting across multiple servers\n\n**Non-functional:**\n- Low latency — should not slow down request processing\n- Accurate counting under high concurrency\n- Fault tolerance',
        requirements: [
            'Algorithm selection: token bucket, leaking bucket, fixed window, sliding window',
            'Distributed rate limiting with Redis',
            'Race condition handling',
            'Rule configuration and flexibility',
            'Monitoring and alerting',
        ],
        evaluationDimensions: {
            apiDesign: 'Rate limiter middleware design, response headers (X-RateLimit-Remaining)',
            dataModel: 'Counter storage in Redis, rule configuration schema',
            algorithm: 'Understanding of different algorithms and their tradeoffs',
            scalability: 'Distributed counting, synchronization across nodes',
            tradeoffs: 'Accuracy vs. performance, memory usage vs. precision',
        },
    },
    {
        id: 'sd05',
        title: 'Design a Web Crawler',
        difficulty: 'medium',
        description:
            'Design a web crawler that systematically browses the web to collect and index web pages.\n\n**Functional Requirements:**\n- Crawl billions of web pages\n- Handle different content types (HTML, images, etc.)\n- Respect robots.txt and be a polite crawler\n- Detect and handle duplicate content\n- Extract and follow links from pages\n\n**Non-functional:**\n- Scalability to handle billions of pages\n- Robustness against malicious pages\n- Politeness — don\'t overwhelm any single server',
        requirements: [
            'BFS vs. DFS crawling strategy',
            'URL frontier management and prioritization',
            'Duplicate detection (URL-level and content-level)',
            'DNS resolution caching',
            'Distributed architecture with multiple crawler workers',
        ],
        evaluationDimensions: {
            apiDesign: 'Crawler service interfaces, seed URL management',
            dataModel: 'URL frontier queue, visited URL store, content storage',
            scalability: 'Distributed crawling, horizontal scaling of workers',
            reliability: 'Handling failures, retries, timeout management',
            tradeoffs: 'Breadth-first vs. depth-first, freshness vs. coverage',
        },
    },
    {
        id: 'sd06',
        title: 'Design YouTube / Video Streaming',
        difficulty: 'hard',
        description:
            'Design a video sharing and streaming platform like YouTube.\n\n**Functional Requirements:**\n- Upload and stream videos\n- Search videos by title/description\n- Like/dislike, comment, subscribe\n- Video recommendations\n- Support multiple video qualities (adaptive bitrate)\n\n**Scale:**\n- 2B monthly active users\n- 500 hours of video uploaded per minute',
        requirements: [
            'Video upload pipeline: encoding, transcoding, different resolutions',
            'CDN for video delivery, adaptive bitrate streaming (HLS/DASH)',
            'Video metadata storage and search',
            'Recommendation engine basics',
            'Thumbnail generation and storage',
        ],
        evaluationDimensions: {
            apiDesign: 'Upload API, streaming API, metadata APIs',
            dataModel: 'Video metadata, user data, comments, likes, subscriptions',
            scalability: 'CDN edge caching, transcoding pipeline scaling, storage partitioning',
            streaming: 'Adaptive bitrate, chunked delivery, buffering strategy',
            tradeoffs: 'Storage cost vs. quality options, pre-transcoding vs. on-demand',
        },
    },
    {
        id: 'sd07',
        title: 'Design a Key-Value Store',
        difficulty: 'medium',
        description:
            'Design a distributed key-value store that provides high availability and partition tolerance (AP system).\n\n**Functional Requirements:**\n- `put(key, value)` — store key-value pair\n- `get(key)` — retrieve value by key\n- Support keys and values of varying sizes\n- Automatic data partitioning and replication\n\n**Non-functional:**\n- High availability (always writable)\n- Eventual consistency\n- Tunable consistency levels',
        requirements: [
            'Consistent hashing for data partitioning',
            'Data replication strategy',
            'Conflict resolution: vector clocks, last-write-wins',
            'Failure detection: gossip protocol',
            'Read/write path optimization',
        ],
        evaluationDimensions: {
            apiDesign: 'Simple get/put API with consistency level parameter',
            dataModel: 'Key-value storage engine (LSM tree / B-tree), metadata',
            scalability: 'Consistent hashing, virtual nodes, data partitioning',
            consistency: 'Quorum reads/writes, vector clocks, conflict resolution',
            tradeoffs: 'CAP theorem understanding, consistency vs. availability tuning',
        },
    },
    {
        id: 'sd08',
        title: 'Design a Notification System',
        difficulty: 'medium',
        description:
            'Design a scalable notification system that supports multiple channels.\n\n**Functional Requirements:**\n- Send notifications via: push notification, SMS, email\n- Support for scheduled notifications\n- User notification preferences (opt-in/out per channel)\n- Notification templates and personalization\n- Rate limiting per user to prevent spam\n\n**Non-functional:**\n- High throughput: 10M notifications/day\n- Soft real-time delivery\n- No duplicate notifications',
        requirements: [
            'Message queue for decoupling and reliability',
            'Worker services per channel (iOS push, Android push, email, SMS)',
            'User preference storage and filtering',
            'Template engine and personalization',
            'Deduplication and idempotency',
        ],
        evaluationDimensions: {
            apiDesign: 'Notification trigger API, preference management API',
            dataModel: 'Notification table, user preferences, templates, delivery logs',
            scalability: 'Queue-based architecture, worker scaling per channel',
            reliability: 'Retry logic, dead letter queues, deduplication',
            tradeoffs: 'Push vs. pull, priority queuing, batching vs. real-time',
        },
    },
    {
        id: 'sd09',
        title: 'Design Google Search Autocomplete',
        difficulty: 'medium',
        description:
            'Design a search autocomplete / typeahead suggestion system.\n\n**Functional Requirements:**\n- As user types a query, show top 5 suggestions\n- Suggestions ranked by popularity / frequency\n- Support multi-language queries\n- Update suggestions based on new trending queries\n\n**Non-functional:**\n- Response time < 100ms\n- High availability\n- Relevant and not offensive suggestions',
        requirements: [
            'Trie data structure for prefix matching',
            'Frequency-based ranking',
            'Data collection pipeline for query analytics',
            'Caching strategy for popular prefixes',
            'Offensive content filtering',
        ],
        evaluationDimensions: {
            apiDesign: 'Suggestion API with debounce strategy',
            dataModel: 'Trie structure, frequency counters, suggestion cache',
            scalability: 'Sharding trie by prefix range, CDN caching of top suggestions',
            performance: 'Sub-100ms response, prefetching, client-side caching',
            tradeoffs: 'Memory vs. query time, freshness vs. stability of suggestions',
        },
    },
    {
        id: 'sd10',
        title: 'Design a Ride-Sharing Service (Uber)',
        difficulty: 'hard',
        description:
            'Design a ride-sharing service like Uber or Lyft.\n\n**Functional Requirements:**\n- Riders request rides, drivers accept rides\n- Real-time location tracking of drivers\n- Matching algorithm: pair riders with nearby drivers\n- ETA calculation and fare estimation\n- Trip history and payment processing\n\n**Scale:**\n- 20M daily active riders\n- 5M daily active drivers',
        requirements: [
            'Location service: geohashing for proximity search',
            'Matching service: driver-rider pairing algorithm',
            'Real-time location updates via WebSocket',
            'ETA calculation with mapping service',
            'Payment service integration',
        ],
        evaluationDimensions: {
            apiDesign: 'Ride request, driver status, trip management APIs',
            dataModel: 'Driver location (geospatial index), trip records, user profiles',
            scalability: 'Geohash-based sharding, location update throughput',
            realtime: 'WebSocket for live tracking, driver dispatch optimization',
            tradeoffs: 'Matching speed vs. optimal pairing, surge pricing logic',
        },
    },
    {
        id: 'sd11',
        title: 'Design an E-Commerce Platform',
        difficulty: 'hard',
        description:
            'Design a large-scale e-commerce platform like Amazon.\n\n**Functional Requirements:**\n- Product catalog with search and filtering\n- Shopping cart and checkout flow\n- Order management and tracking\n- Inventory management with stock reservation\n- User reviews and ratings\n\n**Non-functional:**\n- Handle flash sales with sudden traffic spikes\n- Strong consistency for inventory (no overselling)\n- Payment processing reliability',
        requirements: [
            'Microservice architecture: product, cart, order, payment, inventory',
            'Inventory reservation with distributed locks',
            'Search with Elasticsearch',
            'Cart service with session management',
            'Event-driven architecture for order processing',
        ],
        evaluationDimensions: {
            apiDesign: 'Product, cart, checkout, order APIs with proper idempotency',
            dataModel: 'Product catalog, inventory, orders, payments, user profiles',
            scalability: 'Microservices decomposition, database per service',
            consistency: 'Distributed transactions, saga pattern for orders',
            tradeoffs: 'CAP for inventory, eventual consistency for catalog, ACID for payments',
        },
    },
    {
        id: 'sd12',
        title: 'Design a Content Delivery Network (CDN)',
        difficulty: 'hard',
        description:
            'Design a CDN that efficiently delivers static and dynamic content to users worldwide.\n\n**Functional Requirements:**\n- Cache and serve static assets (images, JS, CSS, videos)\n- Edge server content distribution\n- Cache invalidation and TTL management\n- Origin server fallback\n- HTTPS termination at edge\n\n**Non-functional:**\n- Minimize latency for end users globally\n- Handle massive concurrent requests\n- High cache hit ratio (>95%)',
        requirements: [
            'Edge server architecture and geographic placement',
            'Cache eviction policies (LRU, LFU)',
            'DNS-based request routing to nearest edge',
            'Push vs. pull content deployment',
            'Cache invalidation strategies',
        ],
        evaluationDimensions: {
            apiDesign: 'Content management API, purge API, analytics API',
            dataModel: 'Cache metadata, origin configuration, routing rules',
            scalability: 'Geographic distribution, edge server auto-scaling',
            caching: 'Multi-tier caching, cache consistency, TTL strategies',
            tradeoffs: 'Push vs. pull model, cache size vs. hit rate, cost vs. coverage',
        },
    },
    {
        id: 'sd13',
        title: 'Design Google Docs (Collaborative Editing)',
        difficulty: 'hard',
        description:
            'Design a real-time collaborative document editing system like Google Docs.\n\n**Functional Requirements:**\n- Multiple users can edit the same document simultaneously\n- Real-time sync of changes across all connected users\n- Conflict resolution for concurrent edits\n- Document version history and undo/redo\n- Offline editing with sync on reconnection\n\n**Non-functional:**\n- Real-time collaboration with < 200ms latency\n- Strong eventual consistency\n- Support 50+ concurrent editors per document',
        requirements: [
            'Operational Transformation (OT) or CRDT for conflict resolution',
            'WebSocket for real-time communication',
            'Document storage and versioning',
            'Cursor position synchronization',
            'Access control and permissions',
        ],
        evaluationDimensions: {
            apiDesign: 'Document CRUD, real-time sync protocol, version management',
            dataModel: 'Document storage, operation log, user sessions, permissions',
            concurrency: 'OT vs. CRDT understanding, operation ordering',
            scalability: 'Document-level scaling, WebSocket connection management',
            tradeoffs: 'OT vs. CRDT complexity, latency vs. consistency, storage for version history',
        },
    },
    {
        id: 'sd14',
        title: 'Design a Task Queue / Job Scheduler',
        difficulty: 'medium',
        description:
            'Design a distributed task queue system for background job processing.\n\n**Functional Requirements:**\n- Submit jobs with priority levels\n- Schedule jobs: immediate, delayed, or recurring (cron)\n- Job retry with exponential backoff on failure\n- Job status tracking and result retrieval\n- Dead letter queue for permanently failed jobs\n\n**Non-functional:**\n- At-least-once execution guarantee\n- Horizontal scaling of workers\n- Job execution within SLA',
        requirements: [
            'Queue architecture: Redis-based or message broker (RabbitMQ/Kafka)',
            'Worker pool management and scaling',
            'Priority queue implementation',
            'Scheduler for delayed/cron jobs',
            'Monitoring and alerting on queue depth',
        ],
        evaluationDimensions: {
            apiDesign: 'Job submission, status query, result retrieval APIs',
            dataModel: 'Job table (status, priority, retries, scheduled_at), results storage',
            scalability: 'Worker auto-scaling, queue partitioning, broker clustering',
            reliability: 'At-least-once semantics, idempotent job execution, retry strategy',
            tradeoffs: 'Redis vs. Kafka, pull vs. push to workers, FIFO vs. priority ordering',
        },
    },
    {
        id: 'sd15',
        title: 'Design a Parking Lot System',
        difficulty: 'easy',
        description:
            'Design an object-oriented parking lot system.\n\n**Functional Requirements:**\n- Multiple levels, each level has multiple spots\n- Different spot sizes: compact, regular, large\n- Different vehicle types: motorcycle, car, bus\n- Track available spots and assign nearest spot\n- Calculate parking fee based on duration\n\n**Non-functional:**\n- Support concurrent entry/exit\n- Real-time availability display\n- Multiple entry/exit points',
        requirements: [
            'Object-oriented design: Vehicle, ParkingSpot, ParkingLot, Ticket',
            'Spot allocation strategy',
            'Fee calculation with different rates',
            'Concurrency handling for spot reservation',
            'Display board for availability',
        ],
        evaluationDimensions: {
            apiDesign: 'Entry/exit APIs, availability query, fee calculation',
            dataModel: 'Vehicle hierarchy, spot types, ticket system, rate configuration',
            oopDesign: 'Proper class hierarchy, SOLID principles, design patterns',
            concurrency: 'Thread-safe spot allocation, atomic operations',
            tradeoffs: 'Spot assignment strategy (nearest vs. balanced), pre-booking vs. walk-in',
        },
    },
];

/**
 * 隨機選取 n 道系統設計題目
 */
function selectDesignQuestions(count = 2, difficulty = 'mixed') {
    let pool = [...systemDesignQuestions];

    if (difficulty !== 'mixed') {
        pool = pool.filter((q) => q.difficulty === difficulty);
    }

    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const selected = pool.slice(0, Math.min(count, pool.length));

    const order = { easy: 0, medium: 1, hard: 2 };
    selected.sort((a, b) => order[a.difficulty] - order[b.difficulty]);

    return selected;
}

module.exports = { systemDesignQuestions, selectDesignQuestions };
