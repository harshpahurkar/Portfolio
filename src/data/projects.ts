import type { Project } from "@/types";

export const projects: Project[] = [
  // ─── Featured Projects (with case studies) ─────────────
  {
    slug: "global-billing-service",
    title: "Global Billing Service",
    tagline: "Production-ready billing microservice powering multi-currency payments",
    hookMetric: "39 currencies · Stripe integration · Deployed on AWS ECS",
    tags: ["Python", "FastAPI", "PostgreSQL", "Stripe", "AWS", "Docker"],
    github: "https://github.com/harshpahurkar/global-billing-service",
    featured: true,
    order: 1,
    gradient: "from-cyan-500/20 via-blue-500/10 to-purple-500/5",
    caseStudy: {
      problem:
        "SaaS platforms need billing systems that handle subscription lifecycle, multi-currency payments, and invoice generation, but most solutions are either too simple or too complex. This microservice hits the sweet spot: a clean, production-ready billing engine that supports 39 currencies, full subscription management, and Stripe integration out of the box.",
      architecture: {
        nodes: [
          { id: "clients", label: "Client Apps", sublabel: "Web / Mobile", layer: 1, position: { x: 300, y: 20 }, size: { width: 160, height: 50 } },
          { id: "alb", label: "ALB", sublabel: "HTTPS :443", layer: 2, position: { x: 300, y: 110 }, size: { width: 160, height: 50 } },
          { id: "fastapi", label: "FastAPI", sublabel: "API → Service → Data", layer: 3, position: { x: 300, y: 200 }, size: { width: 160, height: 50 } },
          { id: "postgres", label: "PostgreSQL", sublabel: "RDS", layer: 4, position: { x: 180, y: 300 }, size: { width: 140, height: 50 } },
          { id: "stripe", label: "Stripe API", sublabel: "Payments", layer: 4, position: { x: 440, y: 300 }, size: { width: 140, height: 50 } },
          { id: "ecs", label: "ECS Fargate", sublabel: "Container Runtime", layer: 5, position: { x: 180, y: 390 }, size: { width: 140, height: 50 } },
          { id: "cloudwatch", label: "CloudWatch", sublabel: "Logs & Metrics", layer: 5, position: { x: 440, y: 390 }, size: { width: 140, height: 50 } },
        ],
        connections: [
          { from: "clients", to: "alb", label: "HTTPS", layer: 2 },
          { from: "alb", to: "fastapi", layer: 2 },
          { from: "fastapi", to: "postgres", label: "TCP", layer: 3 },
          { from: "fastapi", to: "stripe", label: "REST", layer: 3 },
          { from: "fastapi", to: "ecs", layer: 4 },
          { from: "fastapi", to: "cloudwatch", label: "Logs", layer: 5 },
        ],
      },
      deepDive: [
        {
          question: "Why FastAPI over Flask?",
          answer:
            "FastAPI gives me automatic request validation via Pydantic, async support out of the box, and auto-generated OpenAPI docs. For a billing service where every request must be validated strictly (you don't want a malformed currency code hitting Stripe), Pydantic models are non-negotiable. Flask would have meant writing all that validation manually.",
        },
        {
          question: "How do you handle 39 currencies correctly?",
          answer:
            "Each currency has a minimum charge amount (e.g., $0.50 USD, ¥50 JPY). I built a validation layer that checks every payment against currency-specific minimums before it ever reaches Stripe. Because charging someone in Japanese yen the way you'd charge in US dollars is a good way to lose money.",
        },
        {
          question: "Why idempotent payment operations?",
          answer:
            "Network failures happen. If a client retries a payment request, you can't charge them twice. Every payment operation uses an idempotency key. If Stripe sees the same key twice, it returns the original result instead of processing a new charge. This is table-stakes for production payment systems but something most portfolio projects skip entirely.",
        },
        {
          question: "How is the subscription lifecycle managed?",
          answer:
            "Subscriptions move through states: created → active → upgraded/downgraded → canceled → reactivated. Each transition has webhook-driven status updates from Stripe, so the system is always in sync with Stripe's state. No polling, no cron jobs. Just real-time webhooks.",
        },
      ],
      codeSpotlight: {
        code: `CURRENCY_MINIMUMS: dict[str, int] = {
    "usd": 50, "eur": 50, "gbp": 30,
    "jpy": 50, "cad": 50, "aud": 50,
    # ... 39 currencies total
}

def validate_charge_amount(
    amount: int, currency: str
) -> None:
    """Validate charge meets currency minimum."""
    currency = currency.lower()
    if currency not in CURRENCY_MINIMUMS:
        raise InvalidCurrencyError(
            f"Unsupported currency: {currency}"
        )
    minimum = CURRENCY_MINIMUMS[currency]
    if amount < minimum:
        raise AmountTooSmallError(
            f"Minimum for {currency.upper()}: "
            f"{minimum} (got {amount})"
        )`,
        language: "python",
        filename: "billing/services/currency.py",
        annotation:
          "Every payment hits this validation before touching Stripe. Currency-specific minimums prevent failed charges and protect revenue integrity.",
      },
      features: [
        {
          heading: "Payment Processing",
          items: [
            "39 currencies with per-currency minimum validation",
            "Idempotent payment operations via Stripe idempotency keys",
            "Stripe Checkout session integration",
            "Webhook-driven real-time payment status updates",
          ],
        },
        {
          heading: "Subscription Management",
          items: [
            "Full lifecycle: create → upgrade → downgrade → cancel → reactivate",
            "Automated invoice generation with sequential numbering (INV-YYYYMM-XXXX)",
            "Plan comparison and prorated billing support",
          ],
        },
        {
          heading: "Infrastructure",
          items: [
            "API Key Authentication with JWT",
            "Health monitoring endpoint",
            "Structured JSON logging with structlog",
            "CORS configuration for cross-origin access",
          ],
        },
      ],
      testing: {
        description:
          "27 tests across 5 categories covering every critical path in the billing system.",
        count: "27 tests across 5 categories",
        strategy: [
          "SQLite in-memory database for fast, isolated test runs",
          "Mocked Stripe API for deterministic tests without real API calls",
          "Separate test categories: Customers (7), Plans (5), Subscriptions (6), Invoices & Payments (6), Currencies & Health (3)",
        ],
      },
      cicd: "Push to main → Lint (Ruff) → Test (PostgreSQL service container) → Build Docker image → Push to ECR → Deploy to ECS Fargate via GitHub Actions",
      results: [
        "39 currencies supported with proper minimum charge validation",
        "27 tests with full mocked Stripe coverage",
        "Automated invoice generation with sequential numbering",
        "Production-ready Docker deployment on AWS ECS Fargate",
      ],
    },
  },
  {
    slug: "fragments",
    gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/5",
    title: "Fragments Microservice",
    tagline: "Cloud-native content microservice with AWS infrastructure",
    hookMetric: "S3 + DynamoDB + Cognito auth · Full CI/CD on AWS ECS",
    tags: ["Node.js", "Express", "AWS", "Docker", "Jest"],
    github: "https://github.com/harshpahurkar/fragments",
    featured: true,
    order: 2,
    caseStudy: {
      problem:
        "Modern applications need a flexible content storage service that can handle multiple formats, convert between them on-the-fly, and scale with cloud-native infrastructure. Fragments is a microservice that stores user-scoped content fragments with authentication, format conversion, and extensible storage backends. Designed to run on AWS from day one.",
      architecture: {
        nodes: [
          { id: "client", label: "Client / UI", sublabel: "Parcel + OIDC", layer: 1, position: { x: 300, y: 20 }, size: { width: 160, height: 50 } },
          { id: "express", label: "Express", sublabel: "API Server", layer: 2, position: { x: 300, y: 110 }, size: { width: 160, height: 50 } },
          { id: "cognito", label: "Cognito", sublabel: "JWT Auth", layer: 3, position: { x: 500, y: 160 }, size: { width: 130, height: 50 } },
          { id: "s3", label: "S3", sublabel: "Object Storage", layer: 4, position: { x: 180, y: 260 }, size: { width: 130, height: 50 } },
          { id: "dynamodb", label: "DynamoDB", sublabel: "Metadata", layer: 4, position: { x: 420, y: 260 }, size: { width: 130, height: 50 } },
          { id: "converter", label: "Converter", sublabel: "Format Pipeline", layer: 5, position: { x: 300, y: 350 }, size: { width: 160, height: 50 } },
        ],
        connections: [
          { from: "client", to: "express", label: "HTTPS", layer: 2 },
          { from: "express", to: "cognito", label: "JWT", layer: 3 },
          { from: "express", to: "s3", layer: 4 },
          { from: "express", to: "dynamodb", layer: 4 },
          { from: "express", to: "converter", layer: 5 },
        ],
      },
      deepDive: [
        {
          question: "Why three storage backends?",
          answer:
            "The storage layer is an abstraction. In development, fragments live in memory (fast, no setup). In staging, they go to S3 + DynamoDB. In production, same. But the point is the application code doesn't know or care which backend is active. Swap the strategy, not the code. This is the Strategy pattern applied to infrastructure.",
        },
        {
          question: "How does content negotiation work?",
          answer:
            "When you request a fragment with a file extension (e.g., GET /v1/fragments/:id.html), the server checks if conversion is possible from the stored type to the requested type. Markdown to HTML? Sure. PNG to JPEG? Done via Sharp. JSON to YAML? No problem. The conversion pipeline is modular. Adding a new format means adding one function.",
        },
        {
          question: "Why Cognito for auth?",
          answer:
            "AWS Cognito gives me JWT-based authentication that integrates natively with the rest of the AWS stack. The frontend uses Cognito's Hosted UI for OAuth flows. The backend validates JWTs on every request. This means user-scoped data isolation: you can only see your own fragments.",
        },
      ],
      codeSpotlight: {
        code: `class StorageStrategy {
  constructor(type) {
    switch (type) {
      case 'memory':
        this.backend = new MemoryStorage();
        break;
      case 's3':
        this.backend = new S3Storage();
        break;
      case 'dynamodb':
        this.backend = new DynamoDBStorage();
        break;
    }
  }

  async readFragment(ownerId, id) {
    return this.backend.readFragment(ownerId, id);
  }

  async writeFragment(fragment) {
    return this.backend.writeFragment(fragment);
  }
}`,
        language: "javascript",
        filename: "src/model/data/storage.js",
        annotation:
          "The storage abstraction layer. Application code calls readFragment() and writeFragment() without knowing if data lives in memory, S3, or DynamoDB. Swap environments, not code.",
      },
      features: [
        {
          heading: "Content Management",
          items: [
            "Create, read, update, delete user-scoped content fragments",
            "Support for text, JSON, HTML, Markdown, images (PNG, JPEG, WebP, GIF)",
            "Fragment tagging system for organization",
          ],
        },
        {
          heading: "Format Conversion",
          items: [
            "On-the-fly conversion: Markdown → HTML, PNG → JPEG, JSON → YAML",
            "Content negotiation via file extension in URL",
            "Modular conversion pipeline, easy to add new formats",
          ],
        },
        {
          heading: "Cloud Infrastructure",
          items: [
            "S3 for binary storage, DynamoDB for metadata",
            "Cognito JWT authentication with user-scoped isolation",
            "Docker containerized, deployed on AWS ECS",
          ],
        },
      ],
      testing: {
        description:
          "Full integration test suite ensuring every API endpoint works correctly across all storage backends.",
        count: "Comprehensive integration tests with Supertest",
        strategy: [
          "Supertest for HTTP-level integration testing",
          "Tests run against in-memory storage for speed",
          "Hurl files for manual API testing workflows",
        ],
      },
      cicd: "Docker build → Push to ECR → Deploy to ECS via GitHub Actions. Frontend deployed separately via Parcel build.",
      results: [
        "3 interchangeable storage backends (memory, S3, DynamoDB)",
        "On-the-fly format conversion between 8+ content types",
        "User-scoped data isolation via Cognito JWT authentication",
        "Cloud-native deployment on AWS ECS with Docker",
      ],
    },
  },
  {
    slug: "redis-search-engine",
    gradient: "from-red-500/20 via-orange-500/10 to-yellow-500/5",
    title: "Redis Search Engine",
    tagline: "TF-IDF search engine built on Redis sorted sets",
    hookMetric: "10,000+ documents indexed · Sub-millisecond queries",
    tags: ["Python", "Redis", "TF-IDF", "CLI"],
    github: "https://github.com/harshpahurkar/redis-search-engine",
    featured: true,
    order: 3,
    caseStudy: {
      problem:
        "Full-text search is a fundamental problem in computer science, but most developers just plug in Elasticsearch without understanding what happens underneath. This project builds a search engine from scratch using Redis sorted sets for storage and TF-IDF for relevance ranking. This proves you can build high-performance search with surprisingly simple primitives.",
      architecture: {
        nodes: [
          { id: "cli", label: "CLI Input", sublabel: "argparse", layer: 1, position: { x: 80, y: 160 }, size: { width: 130, height: 50 } },
          { id: "tokenizer", label: "Tokenizer", sublabel: "Stop Words", layer: 2, position: { x: 250, y: 160 }, size: { width: 130, height: 50 } },
          { id: "tf", label: "TF Calculator", sublabel: "Term Frequency", layer: 3, position: { x: 420, y: 160 }, size: { width: 130, height: 50 } },
          { id: "redis", label: "Redis", sublabel: "Sorted Sets", layer: 4, position: { x: 420, y: 270 }, size: { width: 130, height: 50 } },
          { id: "query", label: "Query Engine", sublabel: "IDF + Ranking", layer: 5, position: { x: 250, y: 270 }, size: { width: 130, height: 50 } },
          { id: "results", label: "Ranked Results", sublabel: "JSON Output", layer: 5, position: { x: 80, y: 270 }, size: { width: 130, height: 50 } },
        ],
        connections: [
          { from: "cli", to: "tokenizer", layer: 2 },
          { from: "tokenizer", to: "tf", layer: 3 },
          { from: "tf", to: "redis", label: "ZADD", layer: 4 },
          { from: "redis", to: "query", label: "ZUNIONSTORE", layer: 5 },
          { from: "query", to: "results", layer: 5 },
        ],
      },
      deepDive: [
        {
          question: "Why Redis sorted sets instead of a regular database?",
          answer:
            "Redis sorted sets give me O(log N) inserts and O(log N + M) range queries, where M is the result size. For a search engine, the \"score\" in a sorted set IS the relevance score. ZUNIONSTORE lets me combine scores across multiple terms with custom weights (the IDF component) in a single atomic operation. It's elegant. The data structure IS the algorithm.",
        },
        {
          question: "How does TF-IDF scoring work here?",
          answer:
            "TF (term frequency) counts how often a word appears in a document, stored as the score in Redis sorted sets at index time. IDF (inverse document frequency) is computed at query time: log(total_documents / documents_containing_term). The final score is TF × IDF. High TF-IDF means a word is frequent in this document but rare globally. Exactly what you want for relevance ranking.",
        },
        {
          question: "How do negative search terms work?",
          answer:
            "When you search 'python -flask', the engine first finds all documents matching 'python', then computes the set of documents containing 'flask', and subtracts using Redis ZDIFFSTORE. The set operations make this trivially efficient. No iteration needed.",
        },
      ],
      codeSpotlight: {
        code: `def _compute_scores(self, terms, n_docs):
    """Compute TF-IDF scores for search terms."""
    weights = {}
    for term in terms:
        df = self.redis.scard(f"idx:{term}")
        if df == 0:
            continue
        # IDF: log(N / df) - rare terms score higher
        idf = math.log(n_docs / df)
        weights[f"idx:{term}"] = idf

    if not weights:
        return []

    # ZUNIONSTORE: combine sorted sets with IDF weights
    # TF is already the score; multiply by IDF
    dest = f"tmp:search:{uuid4().hex}"
    self.redis.zunionstore(dest, weights)
    results = self.redis.zrevrange(
        dest, 0, -1, withscores=True
    )
    self.redis.delete(dest)
    return results`,
        language: "python",
        filename: "search/engine.py",
        annotation:
          "The core of the search engine. TF is stored as Redis sorted set scores at index time. At query time, IDF weights are computed and ZUNIONSTORE combines everything in one atomic operation. The data structure IS the algorithm.",
      },
      features: [
        {
          heading: "Search & Indexing",
          items: [
            "TF-IDF relevance scoring with logarithmic IDF",
            "Tokenization with English stop word filtering",
            "Negative term exclusion (e.g., 'search -redis')",
            "JSON bulk loader for batch document indexing",
          ],
        },
        {
          heading: "Performance",
          items: [
            "Redis pipelines for batch operations during indexing",
            "Sub-millisecond query response on 10,000+ documents",
            "Pagination support with --offset and --limit",
          ],
        },
        {
          heading: "Interface",
          items: [
            "Full CLI: index, search, remove, stats commands",
            "JSON output support for scripting",
            "Programmatic usage via SearchEngine class",
          ],
        },
      ],
      testing: {
        description:
          "Unit and integration tests covering indexing, search ranking, negative terms, and edge cases.",
        count: "Unit + integration test suite",
        strategy: [
          "Tests run against a local Redis instance",
          "Covers indexing, search, negative terms, pagination, and stats",
        ],
      },
      results: [
        "10,000+ documents indexed with sub-millisecond query response",
        "TF-IDF scoring produces Google-relevant ranking quality",
        "Negative term exclusion via Redis set operations",
        "Clean CLI interface with JSON output support",
      ],
    },
  },
  {
    slug: "housify",
    gradient: "from-violet-500/20 via-purple-500/10 to-pink-500/5",
    title: "Housify",
    tagline: "AI + blockchain real estate platform, Seneca Hackathon 2024",
    hookMetric: "Blockchain deed verification · Built in 24 hours with a team of 4",
    tags: ["JavaScript", "Solidity", "Ethereum", "AI", "Vercel"],
    github: "https://github.com/harshpahurkar/Housify",
    live: "https://housify-2024.vercel.app",
    featured: true,
    order: 4,
    caseStudy: {
      problem:
        "Toronto's real estate market lacks transparency. Deed verification is slow, pricing feels opaque, and buyers have no objective way to assess property condition. Housify tackles all three: blockchain-based deed verification for trust, AI-powered property analysis for insights, and dynamic pricing models for transparency. Built in 24 hours at Seneca Hackathon 2024.",
      architecture: {
        nodes: [
          { id: "frontend", label: "React Frontend", sublabel: "Vercel", layer: 1, position: { x: 300, y: 20 }, size: { width: 160, height: 50 } },
          { id: "backend", label: "Node.js Backend", sublabel: "Express API", layer: 2, position: { x: 300, y: 120 }, size: { width: 160, height: 50 } },
          { id: "ai", label: "AI Engine", sublabel: "Property Analysis", layer: 3, position: { x: 150, y: 230 }, size: { width: 140, height: 50 } },
          { id: "ethereum", label: "Ethereum", sublabel: "Hardhat Network", layer: 3, position: { x: 460, y: 230 }, size: { width: 140, height: 50 } },
          { id: "contract", label: "Smart Contract", sublabel: "Deed Verification", layer: 4, position: { x: 460, y: 330 }, size: { width: 140, height: 50 } },
        ],
        connections: [
          { from: "frontend", to: "backend", label: "REST", layer: 2 },
          { from: "backend", to: "ai", layer: 3 },
          { from: "backend", to: "ethereum", layer: 3 },
          { from: "ethereum", to: "contract", label: "Deploy", layer: 4 },
        ],
      },
      deepDive: [
        {
          question: "Why blockchain for deed verification?",
          answer:
            "Real estate deeds are tamper-sensitive documents. Once a deed is recorded on Ethereum, it's immutable. No one can alter ownership records after the fact. The smart contract stores deed hashes with timestamps, creating an auditable chain of ownership. In a market riddled with fraud, this is the kind of trust layer that matters.",
        },
        {
          question: "How did the team split work in 24 hours?",
          answer:
            "Four people, 24 hours, clear separation: I focused on the backend API and infrastructure. Mukul handled the React frontend. Prabhjot built the AI analysis engine. Jashan worked on the blockchain smart contracts. We communicated through a shared API contract. We defined endpoints early, built in parallel, integrated at the end.",
        },
        {
          question: "What does the AI property analysis do?",
          answer:
            "The AI engine analyzes property images using computer vision to assess condition, identifies comparable properties for pricing, and generates property insights that help buyers make informed decisions. It's not replacing human inspectors. It's giving buyers a starting point before they commit to a viewing.",
        },
      ],
      codeSpotlight: {
        code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeedVerification {
    struct Deed {
        string propertyId;
        address owner;
        bytes32 documentHash;
        uint256 timestamp;
        bool isVerified;
    }

    mapping(string => Deed) public deeds;

    event DeedRegistered(
        string propertyId,
        address owner,
        uint256 timestamp
    );

    function registerDeed(
        string memory _propertyId,
        bytes32 _documentHash
    ) public {
        deeds[_propertyId] = Deed(
            _propertyId, msg.sender,
            _documentHash, block.timestamp, true
        );
        emit DeedRegistered(
            _propertyId, msg.sender,
            block.timestamp
        );
    }
}`,
        language: "solidity",
        filename: "contracts/DeedVerification.sol",
        annotation:
          "The core smart contract. Once a deed is registered, it's immutable on the blockchain. No one can tamper with ownership records. The documentHash ensures the original deed document hasn't been altered.",
      },
      features: [
        {
          heading: "Blockchain",
          items: [
            "Ethereum smart contract for immutable deed registration",
            "Document hash verification for tamper detection",
            "On-chain ownership history with timestamps",
          ],
        },
        {
          heading: "AI & Analysis",
          items: [
            "Computer vision property condition assessment",
            "Dynamic pricing engine based on comparable properties",
            "AI-powered property insights for buyers",
          ],
        },
        {
          heading: "Platform",
          items: [
            "React frontend deployed on Vercel",
            "Node.js backend with Express API",
            "Team of 4, built in 24 hours at Seneca Hackathon 2024",
          ],
        },
      ],
      testing: {
        description:
          "Focused on smart contract testing to ensure deed registration and verification work correctly.",
        strategy: [
          "Hardhat test suite for smart contract verification",
          "Manual API testing during the hackathon sprint",
        ],
      },
      cicd: "Push to GitHub → Vercel auto-detects changes → Builds and deploys to Vercel Edge Network",
      results: [
        "Blockchain-based deed verification with immutable records",
        "AI property analysis with computer vision",
        "Dynamic pricing engine for market transparency",
        "Built and deployed in 24 hours by a team of 4",
      ],
    },
  },

  // ─── Other Projects (no case studies) ──────────────────
  {
    slug: "fltk-text-editor",
    title: "FLTK Text Editor",
    tagline: "Cross-platform GUI text editor from scratch",
    hookMetric: "310 lines of C++ · Full GUI from scratch",
    tags: ["C++", "FLTK", "CMake"],
    github: "https://github.com/harshpahurkar/fltk-text-editor",
    featured: false,
    order: 1,
  },
  {
    slug: "shelfstack",
    title: "ShelfStack",
    tagline: "Library management system with OOP design patterns",
    hookMetric: "Template Method + Polymorphism + Composition",
    tags: ["C++", "OOP", "File I/O"],
    github: "https://github.com/harshpahurkar/ShelfStack",
    featured: false,
    order: 2,
  },
  {
    slug: "dermoscanners",
    title: "DermoScanners",
    tagline: "AI skin analysis platform, team capstone project",
    hookMetric: "AI analysis + product recommendations · Full-stack TypeScript",
    tags: ["TypeScript", "React", "Node.js", "MongoDB"],
    github: "https://github.com/harshpahurkar/Dermoscanners",
    live: "https://prj-666-nbb-team5.vercel.app",
    featured: false,
    order: 3,
  },
];

export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
}

export function getOtherProjects(): Project[] {
  return projects
    .filter((p) => !p.featured)
    .sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project | undefined {
  const featured = getFeaturedProjects();
  const idx = featured.findIndex((p) => p.slug === slug);
  return idx < featured.length - 1 ? featured[idx + 1] : undefined;
}

export function getPrevProject(slug: string): Project | undefined {
  const featured = getFeaturedProjects();
  const idx = featured.findIndex((p) => p.slug === slug);
  return idx > 0 ? featured[idx - 1] : undefined;
}
