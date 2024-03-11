import loggers from './utils/loggers.js';
import config from './utils/config.js';
import app from './app.js';

app.listen(config.PORT, () => {
  loggers.info(`Server running on port ${config.PORT}`);
});
