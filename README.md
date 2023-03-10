<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Descrição

Projeto pessoal feito com [Nest](https://github.com/nestjs/nest) como backend e futuramente com uma conexão frontend [ReactJS](https://reactjs.org/) que está sendo construido pelo [Eduardo](https://github.com/edusmpaio). 

Esse projeto se trata de um sistema de controle de gastos com login e registro por meio de [PassportJS](https://www.passportjs.org/) utilizando Local e JWT strategy para construir um sistema com refresh token. 

Também foi utilizado GraphQL para comunicação com a API, caso queira visualizar as schemas do projeto acesse o link do [APP](https://dt-money.herokuapp.com/graphql), a introspection do Apollo está ativada em ambiente de produção somente para que essa visualização seja possivel, não sendo uma boa prática para projetos em produção reais.

## Instalação

```bash
$ pnpm install
```

## Rodar o App

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## License

Nest is [MIT licensed](LICENSE).
