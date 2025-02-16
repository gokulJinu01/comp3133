// schema.js (GraphQL Schema)
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String! # 🔥 Ensure this is included in the database but never exposed
    created_at: String
    updated_at: String
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  type Query {
    getAllEmployees: [Employee]
    getAllUsers: [User]  # ✅ Fix: Ensured it is present
    searchEmployeeById(eid: ID!): Employee  # ✅ Match resolver function name
    searchEmployeeByDesignationOrDepartment(designation: String, department: String): [Employee]
    login(username: String!, password: String!): String  # ✅ Moved inside Query
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    updateUser(username: String!, email: String!): User
    deleteUser(username: String!): String  # ✅ Ensure it returns a string response
    addEmployee(
      first_name: String!,
      last_name: String!,
      email: String!,
      gender: String!,
      designation: String!,
      salary: Float!,
      date_of_joining: String!,
      department: String!,
      employee_photo: String
    ): Employee
    updateEmployeeById(
      eid: ID!,
      first_name: String,
      last_name: String,
      email: String,
      gender: String,
      designation: String,
      salary: Float,
      department: String,
      employee_photo: String
    ): Employee
    deleteEmployeeById(eid: ID!): String
  }
`;

module.exports = typeDefs;