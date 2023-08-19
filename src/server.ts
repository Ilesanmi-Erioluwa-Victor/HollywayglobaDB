


import { ENV } from './configurations/config';






const startConnection = async () => {
  try {
    app.listen(ENV.PORT.PORT || 5000, () => {
      console.log(`App running on port ${ENV.PORT.PORT || 5000}`);
    });
  } catch (error: any) {
    console.log(error.message);
  }
};
startConnection();
