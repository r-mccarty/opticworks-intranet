---
title: Code Standards
description: Coding standards and best practices at OpticWorks.
---

## General Principles

### Code Quality
- Write clean, readable, and maintainable code
- Follow the principle of least surprise
- Keep functions small and focused
- Use meaningful variable and function names
- Comment complex logic, not obvious code

### SOLID Principles
- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

## Language-Specific Standards

### TypeScript/JavaScript

#### Style Guide
We follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with some modifications.

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### Naming Conventions
```typescript
// Use PascalCase for classes and types
class UserService {}
interface UserProfile {}
type UserId = string;

// Use camelCase for variables, functions, and methods
const userName = "John";
function getUserById(id: string) {}

// Use UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = "https://api.opticworks.com";

// Prefix interfaces with 'I' only when necessary for disambiguation
interface User {}  // Preferred
interface IUser {} // Only if needed to distinguish from class

// Use descriptive names
// Good
const activeUsers = users.filter(u => u.isActive);

// Bad
const au = users.filter(u => u.isActive);
```

#### Function Guidelines
```typescript
// Prefer arrow functions for callbacks
users.map(user => user.name);

// Use async/await over promises
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Keep functions focused and small (< 50 lines)
function processOrder(order: Order): ProcessedOrder {
  validateOrder(order);
  const payment = processPayment(order);
  const shipment = scheduleShipment(order);
  return { order, payment, shipment };
}
```

#### Error Handling
```typescript
// Always handle errors explicitly
try {
  const data = await fetchData();
  return processData(data);
} catch (error) {
  logger.error("Failed to process data", error);
  throw new ProcessingError("Data processing failed", { cause: error });
}

// Use custom error classes
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}
```

### React/Frontend

#### Component Structure
```typescript
// Functional components with TypeScript
import React, { useState, useEffect } from 'react';

interface UserCardProps {
  userId: string;
  onUserClick?: (userId: string) => void;
}

export function UserCard({ userId, onUserClick }: UserCardProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  if (!user) return <LoadingSpinner />;

  return (
    <div className="user-card" onClick={() => onUserClick?.(userId)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

#### Hooks Guidelines
```typescript
// Custom hooks should start with 'use'
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
}

// Use hooks at the top level only
// Never inside conditionals or loops
```

#### State Management
```typescript
// Prefer local state when possible
const [count, setCount] = useState(0);

// Use context for shared state
const UserContext = React.createContext<User | null>(null);

// Use Redux/Zustand for complex global state
const useStore = create((set) => ({
  users: [],
  addUser: (user: User) => set((state) => ({
    users: [...state.users, user]
  })),
}));
```

### Python

#### Style Guide
Follow [PEP 8](https://pep8.org/) style guide.

#### Code Examples
```python
# Use type hints
def get_user(user_id: str) -> Optional[User]:
    """Fetch user by ID.

    Args:
        user_id: The unique identifier for the user

    Returns:
        User object if found, None otherwise
    """
    return db.query(User).filter(User.id == user_id).first()

# Use descriptive variable names
active_users = [user for user in users if user.is_active]

# Constants in UPPER_CASE
MAX_CONNECTIONS = 100
DEFAULT_TIMEOUT = 30

# Class names in PascalCase
class UserService:
    def __init__(self, db_connection: Connection):
        self.db = db_connection
```

## Code Organization

### Project Structure

```
project/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # Business logic and API calls
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   ├── types/          # TypeScript type definitions
│   ├── config/         # Configuration files
│   └── constants/      # Application constants
├── tests/
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/            # End-to-end tests
├── public/             # Static assets
└── docs/               # Documentation
```

### File Naming
```
# React components: PascalCase
UserProfile.tsx
UserProfile.test.tsx
UserProfile.module.css

# Utilities and hooks: camelCase
formatDate.ts
useAuth.ts

# Configuration files: kebab-case
eslint-config.js
jest.config.js
```

## Documentation

### Code Comments
```typescript
// Single-line comments for brief explanations
const userId = getUserId(); // Extract from token

/*
 * Multi-line comments for complex logic
 * explanation or documentation
 */

/**
 * JSDoc for functions and classes
 *
 * @param userId - The user's unique identifier
 * @returns The user's profile data
 * @throws {NotFoundError} If user doesn't exist
 */
async function getUserProfile(userId: string): Promise<UserProfile> {
  // Implementation
}
```

### README Files
Every project should include:
- Project description
- Setup instructions
- Environment variables needed
- How to run tests
- Deployment process
- Contributing guidelines

## Testing Standards

### Test Coverage
- Aim for 80%+ code coverage
- Critical paths must have 100% coverage
- All public APIs must be tested

### Test Structure
```typescript
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when ID exists', async () => {
      const user = await userService.getUserById('123');
      expect(user).toBeDefined();
      expect(user.id).toBe('123');
    });

    it('should throw error when ID does not exist', async () => {
      await expect(
        userService.getUserById('invalid')
      ).rejects.toThrow(NotFoundError);
    });
  });
});
```

### Testing Best Practices
- One assertion per test when possible
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Don't test implementation details

## Security Standards

### Input Validation
```typescript
// Always validate and sanitize user input
function createUser(data: unknown): User {
  const validated = userSchema.parse(data); // Use Zod or similar
  return db.users.create(validated);
}

// Never trust client data
if (!isValidEmail(email)) {
  throw new ValidationError("Invalid email format");
}
```

### SQL Injection Prevention
```typescript
// Use parameterized queries
const user = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// Never concatenate user input into SQL
// ❌ BAD
const user = await db.query(`SELECT * FROM users WHERE id = '${userId}'`);
```

### XSS Prevention
```typescript
// Sanitize HTML content
import DOMPurify from 'dompurify';

const cleanHtml = DOMPurify.sanitize(userInput);
```

### Authentication & Authorization
```typescript
// Always verify authentication
function requireAuth(req: Request) {
  if (!req.user) {
    throw new UnauthorizedError();
  }
}

// Check permissions before operations
function requirePermission(user: User, permission: string) {
  if (!user.hasPermission(permission)) {
    throw new ForbiddenError();
  }
}
```

## Performance Standards

### Database Queries
```typescript
// Use indexes for frequently queried fields
// Load only needed fields
const user = await db.users.findOne({
  select: ['id', 'name', 'email'],
  where: { id: userId }
});

// Avoid N+1 queries
const users = await db.users.findMany({
  include: { posts: true } // Load related data in one query
});
```

### Caching
```typescript
// Cache expensive operations
const getCachedUser = async (userId: string) => {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findOne({ id: userId });
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  return user;
};
```

### Frontend Performance
```typescript
// Code splitting
const UserDashboard = lazy(() => import('./UserDashboard'));

// Memoization
const expensiveValue = useMemo(() =>
  computeExpensiveValue(data),
  [data]
);

// Debouncing user input
const debouncedSearch = useDebouncedCallback(
  (value) => performSearch(value),
  300
);
```

## Version Control

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user profile page
fix: resolve authentication timeout issue
docs: update API documentation
refactor: simplify user service logic
test: add tests for payment processing
chore: upgrade dependencies
```

### Branch Naming
```
feature/user-authentication
bugfix/login-timeout
hotfix/security-patch
refactor/database-layer
```

## Code Review Checklist

Before submitting a PR, verify:
- [ ] Code follows style guide
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log or debug code
- [ ] Error handling is proper
- [ ] Security best practices followed
- [ ] Performance considerations addressed
- [ ] Code is properly formatted
- [ ] No sensitive data committed

## Continuous Improvement

### Refactoring
- Regularly refactor to improve code quality
- Use tools like SonarQube for code quality metrics
- Address technical debt in sprint planning

### Learning
- Stay updated with language/framework updates
- Share knowledge in tech talks
- Contribute to internal documentation

## Resources

- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Best Practices](https://react.dev/)

## Questions?

- Ask in **#engineering** Slack channel
- Review existing code in repositories
- Request code review from senior developers
- Attend weekly architecture meetings
