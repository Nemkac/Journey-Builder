// MSW - Mock Service Worker
import { http, HttpResponse } from "msw"
import graphFixture from "../fixtures/graph.json"

export const graphEndpoint = "/api/v1/:tenantId/actions/blueprints/:blueprintId/graph";

export const handlers = [
    http.get(graphEndpoint, () => HttpResponse.json(graphFixture))
]

