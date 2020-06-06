import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviderMonthAvailabilityService = container.resolve(
      ListProviderMonthAvailabilityService,
    );
    const { month, year } = request.body;
    const { provider_id } = request.params;
    const availability = await listProviderMonthAvailabilityService.execute({
      month,
      provider_id,
      year,
    });

    return response.json(availability);
  }
}
