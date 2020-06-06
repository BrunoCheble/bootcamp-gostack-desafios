import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviderDayAvailabilityService = container.resolve(
      ListProviderDayAvailabilityService,
    );
    const { day, month, year } = request.body;
    const { provider_id } = request.params;
    const availability = await listProviderDayAvailabilityService.execute({
      day,
      provider_id,
      month,
      year,
    });

    return response.json(availability);
  }
}
