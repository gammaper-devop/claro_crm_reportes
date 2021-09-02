/**
 * Define la estructura con la información necesaria
 * para el control de las aplicaciones
 */
export interface MicroApp {
  async: boolean;
  clearContent: boolean;
  path: string;
  preload: boolean;
  route: string;
  tag: string;
  topicName: string;
  wrapperTag: string;
}
