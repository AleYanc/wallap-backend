const queries = {
  //User queries
  getUsers: `select UserId, FirstName, LastName, Email, IdType, IdNumber, PhoneNumberPrefix, PhoneNumber, Country, CreationDate
    from [WalletApi].[dbo].[w_users] order by CreationDate`,
  createUser: `insert into [WalletApi].[dbo].[w_users]
  (FirstName, LastName, Password, Email, IdType, IdNumber, PhoneNumberPrefix, PhoneNumber, Country, CreationDate)
  values
  (@firstName, @lastName, @password, @email, @idType, @idNumber, @phoneNumberPrefix, @phoneNumber, @country, @creationDate)`,
  getUserById: `
    select
      UserId, FirstName, LastName, Email, IdType, IdNumber, PhoneNumberPrefix, PhoneNumber, Country, CreationDate
    from
      [WalletApi].[dbo].[w_users] where UserId = @id`,
  deleteUserById: `delete from [WalletApi].[dbo].[w_users] where UserId = @id`,
  getUserByEmail: `select UserId, FirstName, Email, Password, UserRole from [WalletApi].[dbo].[w_users] where Email = @email`,
  getUserAccounts: `select UserId, AccountId, Balance, Currency from [WalletApi].[dbo].[Accounts] where UserId = @id`,
  getUserTransactions: `select Concept, Amount, OriginAccount, DestinyAccount, TransactionStatus from Transactions where UserId = @id`,

  // Account queries
  getAllAccounts: `select UserId, AccountId, Balance, Currency from [WalletApi].[dbo].[Accounts]`,
  createAccount: `insert into [WalletApi].[dbo].[Accounts] (UserId, Currency) values (@id, @currency)`,
  getAccountById: `select UserId, AccountId, Balance, Currency from [WalletApi].[dbo].[Accounts] where AccountId = @id`,
  deleteAccountById: `delete from [WalletApi].[dbo].[Accounts] where AccountId = @id`,

  // Transactions - Money transfer
  addNewTransfer: `insert into [WalletApi].[dbo].[MoneyTransfer]
    (UserId, OriginAccount, DestinyAccount, Amount, ExchangedAmount, Concept, CreationDate)
    values
    (@userId, @originAccount, @destinyAccount, @amount, @exchangedAmount, @concept, @creationDate)
  `,
  getCurrency: `select Currency from Accounts where AccountId = @id`,
  executeMoneyTransfers: 'exec sp_ExecuteTransactions',

  // Transactions - Investments
  newInvestment: `insert into Investments
    (UserId, AccountId, Amount, CreationDate)
    values (@userId, @accountId, @amount, @creationDate)`,
  executeInvestments: `update Investments set Amount = Amount + (Amount * 0.02) where InvestmentStatus = 'Ongoing'`,
  startInvestments: `execute sp_ExecuteInvestments`,
  failedInvestments: `delete from Investments where InvestmentStatus = 'Not enough funds'`
}

export { queries }
