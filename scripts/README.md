# E-Voting Test Scripts

This directory contains scripts for testing the e-voting system.

## Create Test Voters

The `createTestVoters.js` script allows you to quickly create multiple test voters for testing purposes.

### Prerequisites

- Node.js installed
- The e-voting application running locally on port 3000

### Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run the script:
   ```
   npm run create-voters
   ```

### Customization

You can modify the script to:
- Change the number of voters to create (default is 50)
- Adjust the delay between API calls (default is 500ms)
- Modify the data generation functions to create different types of test data

### Troubleshooting

If you encounter errors:
- Make sure your e-voting application is running
- Check that the API endpoint is correct (default is http://localhost:3000/api/voter/createVoter)
- Verify that the faculty and major IDs in the script match those in your database 