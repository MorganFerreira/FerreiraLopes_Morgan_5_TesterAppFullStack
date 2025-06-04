# Application de Yoga

Cette application permet à des utilisateurs de s'inscrire à des sessions de Yoga.

## Pré-requis

- Mysql
- Angular (14.1.0 ou supérieur)
- Java 8 et maven

## Récupérer les sources du projet

`git clone https://github.com/MorganFerreira/FerreiraLopes_Morgan_5_TesterAppFullStack_051325`

## Installer la base de données

Se connecter en tant que root dans mysql, puis taper :
- `CREATE DATABASE numdev;`
- dans un terminal depuis le répertoire racine du Testez-une-application-full-stack/ressources/sql, taper : `mysql -u root -p numdev < script.sql`

## Installer l'application

### Front :
  - dans un terminal, depuis la racine du Projet5 : `cd front`
  - puis `npm install`

### Back :
  - depuis un terminal, depuis la racine du Projet5 : `cd back`
  - puis `mvn compile`

## Lancer l'application

### Front :
  - dans un terminal, depuis le répertoire front : `npm run start`
  - l'application est disponible à l'url http://localhost:4200/

### Back :
  - dans un terminal, depuis le répertoire back : `mvn spring-boot:run`
  - l'application est disponible à l'url http://localhost:8080/

## Lancer les tests

### Front :
  - dans un terminal, depuis le répertoire front : `npm run test`

### End to end :
  - dans un terminal, depuis le répertoire front : `npm run e2e`
  - Cypress s'ouvre, choisir un navigateur de test puis cliquer sur allTest.cy.ts

### Back :
  - dans un terminal, depuis le répertoire back : `mvn clean test`

## Générer les rapports de couverture.

### Front :
  - dans un terminal, depuis le répertoire front : `npm run test:coverage`
  - Présent dans front/coverage/jest/lcov-report/index.html

### End to end :
  - dans un terminal, depuis le répertoire front : `npm run e2e`
  - dans un terminal, depuis le répertoire front : `npm run e2e:coverage`
  - Présent dans front/coverage/lcov-report/index.html

### Back :
  - dans un terminal, depuis le répertoire back : `mvn clean test`
  - Présent dans back/target/site/jacoco/index.html

