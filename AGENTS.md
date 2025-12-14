# AGENTS.md

- General info about the project are available in @PROJECT.md
- General project Minimum Viable Product (MVP) is available in @.ai/mvp.md - this document is a business concept for a product with just enough features to satisfy early customers and provide feedback for future development
- General project Product Requirements Document (PRD) is available in @.ai/prd.md - this document outlines a product's purpose, features, functionality, and behavior.
- Architecture Decision Record (ADR) lives in docs/adr - when you make decision about some sort of library to solve something please provide new ADR for the selected solution 
- Project structure/architecture is described in @.ai/architecture.md
- Project TechStack is available in @.ai/tech-stack.md
- Project documentation the C4 diagram should be created and maintained by https://docs.structurizr.com/cli
- Always start the work with make the documentation then tests and then implementation
- Validate your solution and progress each time you implement a task from .ai/docs/work/

## Package / library / image version

- always try to be most specific for example - FROM php:8.4.15-cli-alpine3.23 not FROM php:8.4cli

## AI Rules to start with

- Always start investigate how the project behave on the Makefile from there you should run tests and verify your work
- Try to start your work with failing test then implement the solution
- Try to start your work with Business or Application Contract and then add the solution to fill that contract
- If user provides you an contract you are not allowed to change it 
- You could find code snippets on base you could provide better solution in @.ai/snippets/* where the name of dir / file should be corresponding to the snipped you are looking for, for example find files having PHP and generic there are in path @snippetsPath/PHP/Generic/index.php
- When providing the TODO plan for the user show hin also the Contract you will create
- When creating documentation for yourself use the LLMs.txt standard see https://llmstxt.org/ all this documentation should be available in .ai/llms

## Code rules

### General

- Always try to create contract like `Intervace`, `AbstractClass`, `DTO`, `ValueObject`, `Collection`, `Type in TS` rather that simple primitive obsession
- Always prefer Type safe code
- Always try to create Generic code and for languages like PHP use sth like Psalm to describe the code 
- Always try to write code that has SingleResponsibility in mind `SRP`
- Always try to make code that is Open for extension and closed for modification `OPC` - prefer design patterns like `Policy`, `Specification Pattern`, `Builder`, `Chain of responsibility`  
- Always prefer clean code that is not related to framework / library
- If you need to use framework or library use it as Interface contract so that the business says what to do so in `Declarative` way
- IF you use any linting tool or code quality tool or testing tool always try to add its bages to the README.md so its looks nice and provide actual information about the project

### PHP

- use PHP 8.4 for building a code
- always add declare(strict_types=1); 
- for PHPStan rules and changes check https://phpstan.org/config-reference

## Commit messages and branches

- Git workflow, branch naming conventions, and commit message standards are documented in @.ai/git.md
- Follow the branch naming convention: `<type>/<ticket-id>-<short-description>`
- Use conventional commit messages: `<type>(<scope>): <subject>`
- Default workflow: GitHub Flow (feature branches from main, PR for all changes)

## Tooling Versions

- Always pin to specific version when generate code
- Try to investigate compatibility of versions when introduce new tool
- Always try to gen newer possible version when installing new tool ( so check the web for actual newest stable release )
- For developers tooling you could omit the stable release if needed ( for example the documentation says to use beta or dev )

## Tooling architecture

- Tools like `make`, `docker`, `docker compose` commands could be run from host machine
- All other tools like `pint`, `composer`, `npm`, `php`, should be run via configured docker commands or inside actual project Docker images
- We prefer this structure of calling `make` -> `bash scripts` | `docker compose` | `docker` | `docker exec with pinned image version`
- The CI/CD layer should only execute the `make` commands or `bash scripts` if possible even if that requires add the `ci-sth` commands to Makefile

### Makefile rules

- We try to use as simple as possible makefile commands 
- Each command has `PHONY: command-name` before the command itself
- Try to add multiple commands for same action to allow user make commands more naturally for example: `deploy-prod, deploy-production, deploy-to-prod, deploy-to-production` this commands are exact same see @.ai/snippets/Makefile
- Try to be consistent with command naming try to use same prefix or suffix strategy each time for example `quality` runs all quality tests and the you have `quality-stan` that runs PHPStan `quality-psalm` that runs PHP PSALM, same for `fix` and `fix-{suffix}`
- The Make help method should be build upon of the makefile itself not an actual echo documentation because as we know Makefile will change but the according help like @echo wont, so always generate actual help base on the makefile itself
- You could use comments above each Make command to add extra context and always try to make it in "example" way so the user see the actual contract

## Docker / Docker compose rules

- make multiple steps Docker images ( steps for environments dev, test, stage ,prod )
- all docker related files like configs and Dockerfiles should be stored in docker 
- don't add version to docker-compose files as is not required anymore

## Readme and documentations

- documentation is located in docs 
- always create docs before starting work so that user can verify modify and accept or decline the work
- always start searching for actual documentation before start
- always create docs that are readable to AI agents and uses small amount of tokens
- Don't create complex large readme documentation
- Create Code that is self describing, so rather than the readme or helper functions use proper functions names and functions that uses some sort of regression to determine what is possible
- When create a decision about technology / framework etc create an ADR document in docs/adr 

## Playwright rules - create E2E tests and Regression tests

- for each page create a Page Object Model ( POM ) - https://playwright.dev/docs/pom - this page should have full configuration of how interact with the page so basically is a abstraction layer between what vs how ( what is the methods names how is the implementation )
- when we integrates pages with forms create methods that allow select from lists by id, name, first, last or random element of the list - make this as class 