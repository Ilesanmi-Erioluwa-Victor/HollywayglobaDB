import { ENV } from './configurations/config';
import app from './app';
class Server {
  static async Connection(): Promise<void> {
    try {
      app.listen(ENV.PORT.PORT || 3000, () => {
        console.log(`App running on port ${ENV.PORT.PORT || 5000}`);
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}

Server.Connection();

export default new Server();
