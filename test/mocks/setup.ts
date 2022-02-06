import "./react_native"

import { server as ssoServer } from "./sso_api_server"

beforeAll(() => ssoServer.listen())
afterEach(() => ssoServer.resetHandlers())
afterAll(() => ssoServer.close())
