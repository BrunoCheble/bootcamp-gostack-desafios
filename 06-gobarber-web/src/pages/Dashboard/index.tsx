import React, {useState, useCallback, useEffect, useMemo} from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Container, Header, HeaderContent, Profile, Content, Schedule, Calendar, NextAppointment, Section, Appointment } from './styles';
import { useAuth } from '../../hooks/auth';
import logoImg from '../../assets/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number,
  available: boolean
}

const Dashboard: React.FC = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);

  const { signOut, user } = useAuth();

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`,{
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1
      }
    }).then(response => {
      setMonthAvailability(response.data);
    });
  },[currentMonth, user.id]);

  const disabledDays = useMemo(() => {

    const dates = monthAvailability
          .filter(monthDay => monthDay.available == false)
          .map(monthDay => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), monthDay.day));

    return dates;
  },[monthAvailability,currentMonth]);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  },[]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if(modifiers.available) {
      setSelectedDate(day);
    }
  },[]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>
          <button onClick={signOut} type="button"><FiPower /></button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 18</span>
            <span>Segunda-feira</span>
          </p>
          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img src="https://avatars1.githubusercontent.com/u/5677802?s=460&u=45628f8eaef21432d343000d9665472aad2e93bf&v=4" alt="Bruno Cheble"/>
              <strong>Bruno Cheble</strong>
              <span>
                <FiClock />
                13:00
              </span>
            </div>
          </NextAppointment>
          <Section>
            <strong>Manhã</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img src="https://avatars1.githubusercontent.com/u/5677802?s=460&u=45628f8eaef21432d343000d9665472aad2e93bf&v=4" alt="Bruno Cheble"/>
                <strong>Bruno Cheble</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                09:00
              </span>
              <div>
                <img src="https://avatars1.githubusercontent.com/u/5677802?s=460&u=45628f8eaef21432d343000d9665472aad2e93bf&v=4" alt="Bruno Cheble"/>
                <strong>Bruno Cheble</strong>
              </div>
            </Appointment>

          </Section>
          <Section>
            <strong>Tarde</strong>

            <Appointment>
              <span>
                <FiClock />
                13:00
              </span>
              <div>
                <img src="https://avatars1.githubusercontent.com/u/5677802?s=460&u=45628f8eaef21432d343000d9665472aad2e93bf&v=4" alt="Bruno Cheble"/>
                <strong>Bruno Cheble</strong>
              </div>
            </Appointment>

          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
          weekdaysShort={['D','S','T','Q','Q','S','S']}
          fromMonth={new Date()}
          disabledDays={[
            {daysOfWeek: [0,6]},
            ...disabledDays
          ]}
          modifiers={{
            available: {daysOfWeek: [1,2,3,4,5]}
          }}
          selectedDays={selectedDate}
          onDayClick={handleDateChange}
          onMonthChange={handleMonthChange}
          months={[
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro',
          ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
