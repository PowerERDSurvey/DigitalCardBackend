// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     const countries = await queryInterface.sequelize.query(
//       `SELECT id, countryName FROM digitalcard.countries WHERE countryName IN ('India', 'United States');`
//     );
// console.log('countries',countries);
//     const countryRows = countries[0];

//     const india = countryRows.find(country => country.countryName === 'India');
//     const usa = countryRows.find(country => country.counrtyName === 'United States');

//     await queryInterface.bulkInsert('States', [
//       // States of India
//       { name: 'Andhra Pradesh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Arunachal Pradesh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Assam', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Bihar', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Chhattisgarh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Goa', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Gujarat', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Haryana', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Himachal Pradesh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Jharkhand', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Karnataka', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Kerala', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Madhya Pradesh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Maharashtra', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Manipur', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Meghalaya', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Mizoram', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Nagaland', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Odisha', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Punjab', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Rajasthan', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Sikkim', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Tamil Nadu', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Telangana', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Tripura', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Uttar Pradesh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Uttarakhand', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'West Bengal', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Andaman and Nicobar Islands', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Chandigarh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Dadra and Nagar Haveli and Daman and Diu', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Lakshadweep', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Delhi', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Puducherry', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Ladakh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Jammu and Kashmir', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },

//       // States of the USA
//       { name: 'Alabama', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Alaska', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Arizona', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Arkansas', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'California', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Colorado', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Connecticut', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
//       { name: 'Delaware', countryId: usa.id, createdAt: new Date(), updatedAt: new Date
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const countries = await queryInterface.sequelize.query(
      `SELECT id, countryName FROM Countries WHERE countryName IN ('India', 'United States');`
    );

    const countryRows = countries[0];
    const india = countryRows.find(country => country.countryName === 'India');
    const usa = countryRows.find(country => country.countryName === 'United States');

    await queryInterface.bulkInsert('States', [
      // States of India
      { stateName: 'Andhra Pradesh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Arunachal Pradesh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Assam', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Bihar', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Chhattisgarh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Goa', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Gujarat', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Haryana', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Himachal Pradesh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Jharkhand', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Karnataka', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Kerala', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Madhya Pradesh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Maharashtra', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Manipur', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Meghalaya', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Mizoram', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Nagaland', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Odisha', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Punjab', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Rajasthan', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Sikkim', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Tamil Nadu', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Telangana', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Tripura', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Uttar Pradesh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Uttarakhand', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'West Bengal', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Andaman and Nicobar Islands', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Chandigarh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Dadra and Nagar Haveli and Daman and Diu', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Lakshadweep', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Delhi', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Puducherry', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Ladakh', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Jammu and Kashmir', countryId: india.id, createdAt: new Date(), updatedAt: new Date() },

      // States of usa
      { stateName: 'Alabama', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Alaska', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Arizona', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Arkansas', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'California', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Colorado', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Connecticut', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Delaware', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Florida', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Georgia', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Hawaii', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Idaho', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Illinois', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Indiana', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Iowa', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Kansas', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Kentucky', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Louisiana', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Maine', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Maryland', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Massachusetts', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Michigan', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Minnesota', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Mississippi', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Missouri', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Montana', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Nebraska', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Nevada', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'New Hampshire', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'New Jersey', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'New Mexico', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'New York', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'North Carolina', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'North Dakota', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Ohio', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Oklahoma', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Oregon', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Pennsylvania', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Rhode Island', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'South Carolina', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'South Dakota', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Tennessee', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Texas', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Utah', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Vermont', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Virginia', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Washington', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'West Virginia', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Wisconsin', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() },
      { stateName: 'Wyoming', countryId: usa.id, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('States', null, {});
  }
};
