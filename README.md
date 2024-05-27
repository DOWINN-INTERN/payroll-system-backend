<p align="center">
  <a href="https://github.com/DOWINN-INTERN/payroll-system-backend" target="blank"><img src="https://lh3.googleusercontent.com/d/1P-qIRicZKkHpjNgqF42G7aHb0ezIYTvQ" alt="StreamlineOPS" /></a>
</p>

## ⚡ StreamlineOPS

StreamlineOPS (Streamline Operations) – is a comprehensive platform designed to optimize organization management, simplify timekeeping, streamline scheduling, and automate payroll processes. Our intuitive tools empower businesses to efficiently track employee hours, create flexible schedules, and manage payroll seamlessly. With StreamlineOPS, you can enhance productivity, reduce administrative overhead, and focus on what matters most–growing your business.

## ⚙ Core Features

**Organization Management** – Effortlessly organize and access employee information with StreamlineOPS. Centralize employee data, track records, and streamline HR processes for optimal efficiency.

**Schedule Management** – Create and manage schedules with ease using StreamlineOPS. Improve coordination, reduce conflicts, and keep your team on track.

**Timekeeping** – Efficiently manage employee hours and attendance with StreamlineOPS. Streamline time tracking and ensure accurate payroll calculations.

**Payroll Management** – Automate payroll processes with StreamlineOPS. Ensure compliance, eliminate errors, and save time on payroll administration.

## 🐱‍💻 Technologies

- [NestJS](https://nestjs.com/)
- [MySQL](https://www.mysql.com/)
- [TypeORM](https://typeorm.io/)

## 🌲 Directory Tree

```
   payroll-system-backend
    ├── README.md
    ├── nest-cli.json
    ├── package-lock.json
    ├── package.json
    ├── scripts
    ├── src
    │   ├── app.module.ts
    │   ├── app.routes.ts
    │   ├── auth
    │   │   ├── auth.controller.ts
    │   │   ├── auth.module.ts
    │   │   ├── auth.service.ts
    │   │   ├── dtos
    │   │   ├── strategies
    │   │   └── types
    │   ├── branches
    │   │   ├── branches.controller.ts
    │   │   ├── branches.module.ts
    │   │   ├── branches.service.ts
    │   │   ├── dtos
    │   │   └── entities
    │   ├── commons
    │   │   ├── decorators
    │   │   ├── enums
    │   │   ├── filters
    │   │   ├── guards
    │   │   ├── helpers
    │   │   ├── interceptors
    │   │   ├── interfaces
    │   │   └── middleware
    │   ├── db
    │   ├── departments
    │   │   ├── departments.controller.ts
    │   │   ├── departments.module.ts
    │   │   ├── departments.service.ts
    │   │   ├── dtos
    │   │   └── entities
    │   ├── iam
    │   │   ├── dtos
    │   │   ├── entities
    │   │   ├── iam.controller.ts
    │   │   ├── iam.module.ts
    │   │   └── iam.service.ts
    │   ├── main.ts
    │   ├── members
    │   │   ├── credentials.service.ts
    │   │   ├── dtos
    │   │   ├── entities
    │   │   ├── members.controller.ts
    │   │   ├── members.module.ts
    │   │   └── members.service.ts
    │   ├── organizations
    │   │   ├── dtos
    │   │   ├── entities
    │   │   ├── organizations.controller.ts
    │   │   ├── organizations.module.ts
    │   │   ├── organizations.service.ts
    │   │   └── serializers
    │   ├── profiles
    │   │   ├── dtos
    │   │   ├── entities
    │   │   ├── profiles.controller.ts
    │   │   ├── profiles.module.ts
    │   │   └── profiles.service.ts
    │   └── users
    │       ├── dtos
    │       ├── entities
    │       ├── users.controller.ts
    │       ├── users.module.ts
    │       └── users.service.ts
    ├── test
    │   ├── app.e2e-spec.ts
    │   └── jest-e2e.json
    ├── tsconfig.build.json
    └── tsconfig.json
```

## 🚀 Running the app

```bash
# change directory
$ cd payroll-system-backend

# install dependencies
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
