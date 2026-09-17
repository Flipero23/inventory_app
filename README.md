# Систем за инвентар на производи

Full-stack апликација за управување со инвентар на производи.

**Backend:** Spring Boot + PostgreSQL
**Frontend:** Angular + Angular Material

Развиено и тестирано со: **Java 24**, **Spring Boot 4.1.1**, **Angular 21**, **Node 22**, **PostgreSQL 18**.

---

## Структура на проектот

- `backend/` — Spring Boot REST API
- `frontend/` — Angular апликација

---

## Предуслови

- **Java 21+** (проектот е компајлиран за Java 21, развиен со Java 24)
- **Maven** — не е задолжителен, вклучен е Maven Wrapper (`mvnw`)
- **PostgreSQL 14+**
- **Node.js 20+** и **npm**

---

## 1. Конфигурација на базата на податоци

Креирајте празна база:

```sql
CREATE DATABASE inventory_db;
```

Или преку командна линија:

```bash
psql -U postgres -c "CREATE DATABASE inventory_db;"
```

Не е потребно рачно креирање на табели — Hibernate ја креира табелата `products` при првото стартување на backend-от.

### Поставки за конекција

Стандардните вредности се дефинирани во `backend/src/main/resources/application.properties`:

| Поставка | Стандардна вредност |
|---|---|
| URL | `jdbc:postgresql://localhost:5432/inventory_db` |
| Корисник | `postgres` |
| Лозинка | `postgres` |

Ако вашата PostgreSQL инсталација користи различни податоци, поставете ги преку environment променливи пред стартување:

```powershell
# Windows (PowerShell)
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="вашата_лозинка"
```

```bash
# Linux / macOS
export DB_USERNAME=postgres
export DB_PASSWORD=вашата_лозинка
```

Алтернативно, изменете ги директно во `application.properties`.

### Почетни податоци

При првото стартување со празна табела автоматски се внесуваат неколку производи од `backend/src/main/resources/data.sql`, за апликацијата да не биде празна. Ако табелата веќе содржи записи, скриптата не се извршува.

---

## 2. Стартување на backend

Windows (PowerShell):

```powershell
cd backend
.\mvnw spring-boot:run
```

Linux / macOS:

```bash
cd backend
./mvnw spring-boot:run
```

API-то е достапно на **http://localhost:8080**

Проверка: отворете `http://localhost:8080/products` — треба да врати JSON.

---

## 3. Стартување на frontend

Во нов терминал:

```bash
cd frontend
npm install
npm start
```

Апликацијата е достапна на **http://localhost:4200**

> Backend-от мора да работи пред стартување на frontend-от.
> Ако backend-от работи на друг порт, изменете го `baseUrl` во `frontend/src/app/services/product.service.ts`.

---

## API endpoints

| Метод | Патека | Опис |
|---|---|---|
| GET | `/products` | Листа со филтрирање и пагинација |
| GET | `/products/{id}` | Детали за производ |
| POST | `/products` | Креирање производ |
| PUT | `/products/{id}` | Ажурирање производ |
| DELETE | `/products/{id}` | Бришење производ |
| GET | `/products/categories` | Листа на постоечки категории |
| POST | `/products/{id}/image` | Прикачување слика |

### Параметри за `GET /products`

Сите параметри се опционални и може да се комбинираат:

| Параметар | Опис |
|---|---|
| `search` | Пребарување по име (делумно совпаѓање) |
| `category` | Филтер по категорија (точно совпаѓање) |
| `minPrice` | Минимална цена |
| `maxPrice` | Максимална цена |
| `page` | Број на страница (почнува од 0) |
| `size` | Број на записи по страница |
| `sort` | Подредување, на пр. `price,desc` |

Пример:

```
GET /products?search=лаптоп&category=Електроника&minPrice=1000&page=0&size=10
```

---

## Модел на производ

| Поле | Тип | Забелешка |
|---|---|---|
| `id` | Long | Автоматски генериран |
| `name` | String | Задолжително, макс. 100 знаци |
| `description` | String | Опционално, макс. 1000 знаци |
| `price` | BigDecimal | Задолжително, ≥ 0 |
| `quantityInStock` | Integer | Задолжително, ≥ 0 |
| `category` | String | Опционално |
| `imageUrl` | String | Се поставува само преку endpoint-от за слики |
| `createdAt` | Instant | Автоматски |
| `updatedAt` | Instant | Автоматски |

---

## Функционалности

**Основни**

- CRUD операции преку REST API
- Табеларен приказ, форма за додавање и уредување, детален преглед
- Валидации на backend (Bean Validation) и на frontend (Reactive Forms)
- Пораки за успех и неуспех, индикатори за вчитување
- Потврда пред бришење

**Дополнителни**

- Пребарување по име, филтер по категорија и по ценовен опсег
- Пагинација на ниво на база
- Прикачување слики за производи

---

## Технички белешки

- Филтрирањето е имплементирано со **JPA Specifications**, што овозможува комбинирање на повеќе опционални филтри без разгранување по секоја можна комбинација.
- Пагинацијата се извршува на ниво на база (`LIMIT` / `OFFSET`), не во меморија.
- Цената се чува како `BigDecimal` / `numeric(10,2)` заради точност при пресметки со пари.
- Временските ознаки се чуваат како UTC (`Instant`) и се прикажуваат во локалната временска зона на прелистувачот.
- Сликите се зачувуваат во `backend/uploads/` со генерирано UUID име. Прифатени формати: JPEG, PNG и WebP, до 5MB. При замена на слика или бришење на производ, старата датотека се брише од дискот.
- `spring.jpa.hibernate.ddl-auto=update` е користен заради едноставност при развој. Во продукциска околина би се користел **Flyway** или **Liquibase** за верзионирање на шемата.
- CORS е овозможен само за `http://localhost:4200`.
