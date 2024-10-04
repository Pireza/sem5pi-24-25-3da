## Contents
- [Architecture Background](#architecture-background)
	- [Problem Background](#problem-background)
		- [System Overview](#system-overview)
		- [Context](#context)
		- [Driving Requirements](#driving-requirements)
			- [Functional requirements](#functional-requirements)
			- [Quality attributes](#quality-attributes)
				- [Funcionalidade](#funcionalidade)
				- [Usabilidade](#usabilidade)
				- [Confiabilidade (Reliability)](#confiabilidade-reliability)
				- [Desempenho (Performance)](#desempenho-performance)
				- [Suportabilidade](#suportabilidade)
			


# Architecture Background

## Problem Background

### System Overview

De modo a fornecer um meio para que a gestão de recursos e marcação de cirurgias e consultas num hospital, fomos encarregues de desenvolver um sistema que permita aos seus utilizadores tais funções de forma fácil, garantindo a segurança dos dados dos mesmos.

O sistema também irá constar com funcionalidades de visualização 3D da disponibilidade de recursos no estabelecimento, de modo a otimizar a sua utilização.

---

### Context

O protótipo inicial deve ser constituído pelos seguintes módulos:
* Uma aplicação web de backoffice;
* Módulo de visualização 3D;
* Módulo de otimização e planeamento;
* Módulo de GDPR;
* Business Continuity Plan (BCP).

---

### Driving Requirements

#### Functional requirements
1. As an Admin, I want to register new backoffice users;
2. As a Backoffice User, I want to reset my
password;
3. As a Patient, I want to register for the healthcare application;
4. As a Patient, I want to update my user profile;
5. As a Patient, I want to delete my account and all associated data;
6. As a (non-authenticated) Backoffice User, I want to log in to the system;
7. As a Patient, I want to log in to the healthcare system using my external IAM
credentials;
8. As an Admin, I want to create a new patient profile;
9. As an Admin, I want to edit an existing patient profile;
10. As an Admin, I want to delete a patient profile;
11. As an Admin, I want to list/search patient profiles by different attributes;
12. As an Admin, I want to create a new staff profile;
13. As an Admin, I want to edit a staff’s profile;
14. As an Admin, I want to deactivate a staff profile;
15. As an Admin, I want to list/search staff profiles;
16. As a Doctor, I want to request an operation;
17. As a Doctor, I want to update an operation requisition;
18. As a Doctor, I want to remove an operation requisition;
19. As a Doctor, I want to list/search operation requisitions;
20. As an Admin, I want to add new types of operations;
21. As an Admin, I want to edit existing operation types;
22. As an Admin, I want to remove obsolete or no longer performed operation types;
23. As an Admin, I want to list/search operation types.

---

#### Quality attributes
Os atributos de qualidade são categorizados e sistematizados segundo o modelo FURPS+.

FURPS é um acrónimo que representa um modelo para classificação de atributos de qualidade de software (requisitos funcionais e não-funcionais) distribuído da seguinte forma:

##### Funcionalidade
1. Um utilizador deve conseguir registar-se com as suas credenciais e aceder à sua conta.
2. O acesso a determinadas funcionalidades é garantida pelo recurso a autorizações, ou seja, certos utilizadores não poderão desempenhar algumas funções dado não terem permissão para tal;

##### Usabilidade
3. O sistema requer autenticação por meio de serviços IAM para que os utilizadores possam aceder às suas informações e para que possam efetuar os seus pedidos.

##### Confiabilidade (Reliability)

4. A base de dados está normalizada segundo as normas. Assim, a duplicidade de dados é mínimia e a confiabilidade da base de dados é elevada. 

5. Os protocolos http já estão implementados na framework do .NET.

##### Desempenho (Performance)

n/a

##### Suportabilidade

n/a
