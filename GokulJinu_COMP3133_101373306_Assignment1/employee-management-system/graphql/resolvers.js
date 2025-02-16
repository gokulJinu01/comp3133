const { check, validationResult } = require('express-validator');

const resolvers = {
  Mutation: {
    signup: async (_, { username, email, password }) => {
      const errors = validationResult({ username, email, password });
      if (!errors.isEmpty()) throw new Error('Invalid input');

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      return await newUser.save();
    },
    addEmployee: async (_, args) => {
      const errors = validationResult(args);
      if (!errors.isEmpty()) throw new Error('Invalid employee data');

      const newEmployee = new Employee(args);
      return await newEmployee.save();
    }
  }
};
