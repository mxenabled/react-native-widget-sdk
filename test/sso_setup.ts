import { server as ssoServer } from "./mocks/sso_api_server"

beforeAll(() => ssoServer.listen())
afterEach(() => ssoServer.resetHandlers())
afterAll(() => ssoServer.close())
