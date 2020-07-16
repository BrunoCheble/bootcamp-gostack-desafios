import { injectable, inject } from 'tsyringe';
// import { getDate, getDaysInMonth } from 'date-fns';

// import User from '@modules/users/infra/typeorm/entities/User';
import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  availability: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        day,
        month,
        year,
        provider_id,
      },
    );

    const hourStart = 8;
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());
    const availability = eachHourArray.map((hour) => {
      const hasAppointmentInHour = appointments.find(
        ({ date }) => getHours(date) === hour,
      );
      const compareDate = new Date(year, month - 1, day, hour);
      // isAfter()
      return {
        hour,
        availability:
          !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });
    return availability;
  }
}

export default ListProviderDayAvailabilityService;