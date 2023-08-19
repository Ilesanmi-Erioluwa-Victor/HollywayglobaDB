import { ENV } from './configurations/config';
import app from "./app"
class Server {
  static async Connection() {
    try {
      
    } catch (error) {
      
    }
  }
}
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

export default new Server();
