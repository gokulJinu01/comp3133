const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const resolvers = {
    Query: {
        login: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) throw new Error("User not found");

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) throw new Error("Incorrect password");

            return jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        },

        getAllUsers: async () => {
          try {
             const users = await User.find(); // Ensure `User` model is imported
             return users;
          } catch (error) {
             console.error("Error fetching users:", error);
             return null;
          }
       },

        getAllEmployees: async () => {
            return await Employee.find();
        },

        searchEmployeeById: async (_, { eid }) => {
          try {
              console.log(`Searching for Employee with ID: ${eid}`);
              const employee = await Employee.findById(eid);
              if (!employee) {
                  console.log("Employee not found");
                  throw new Error("Employee not found");
              }
              console.log("Employee found:", employee);
              return employee;
          } catch (error) {
              console.error("Error fetching employee:", error.message);
              throw new Error("Error fetching employee");
          }
      },
        searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
            const query = {};
            if (designation) query.designation = designation;
            if (department) query.department = department;

            return await Employee.find(query);
        }
    },

    Mutation: {
        signup: async (_, { username, email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, email, password: hashedPassword });
            return await newUser.save();
        },

        deleteUser: async (_, { username }) => {
            const deletedUser = await User.findOne({ username });
            if (!deletedUser) throw new Error("User not found");
            await User.deleteOne({ username });
            return `User ${username} deleted successfully.`;
        },

        addEmployee: async (_, args) => {
            const newEmployee = new Employee(args);
            return await newEmployee.save();
        },

        updateEmployeeById: async (_, { eid, ...updates }) => {
            return await Employee.findByIdAndUpdate(eid, updates, { new: true });
        },

        updateUser: async (_, { username, email }) => {
          try {
            console.log(`Checking for user: ${username}`);
            const user = await User.findOneAndUpdate(
              { username },
              { email, updated_at: new Date().toISOString() },
              { new: true }
            );
        
            if (!user) {
              console.log("User not found for update");
              throw new Error("User not found");
            }
        
            console.log("User updated:", user);
            return user;
          } catch (error) {
            console.error("Error updating user:", error.message);
            throw new Error("Error updating user");
          }
        },

        deleteEmployeeById: async (_, { eid }) => {
            const deletedEmployee = await Employee.findByIdAndDelete(eid);
            if (!deletedEmployee) throw new Error("Employee not found");
            return `Employee with ID ${eid} deleted successfully.`;
        }
    }
};

module.exports = resolvers;