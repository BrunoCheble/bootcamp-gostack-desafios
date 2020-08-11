import React, {useState, useCallback, useEffect, useMemo} from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Container, Header, HeaderContent, Profile, Content, Schedule, Calendar, NextAppointment, Section, Appointment } from './styles';
import { useAuth } from '../../hooks/auth';
import logoImg from '../../assets/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import api from '../../services/api';
import {isToday, format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface MonthAvailabilityItem {
  day: number,
  available: boolean
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

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

  useEffect(() => {
    api.get<Appointment[]>('/appointments/me',{
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }
    }).then(response => {
      const appointmentsFormatted = response.data.map(appointment => {
        return {
          ...appointment,
          hourFormatted: format(parseISO(appointment.date), 'HH:mm')
        }
      })
      setAppointments(appointmentsFormatted);
    });
  },[selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
          .filter(monthDay => monthDay.available == false)
          .map(monthDay => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), monthDay.day));

    return dates;
  },[monthAvailability,currentMonth]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR
    });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => parseISO(appointment.date).getHours() < 12);
  },[appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => parseISO(appointment.date).getHours() >= 12);
  },[appointments]);

  const selectedweekDay = useMemo(() => {
    return format(selectedDate, "cccc", {
      locale: ptBR
    });
  }, [selectedDate]);

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
            {isToday(new Date(selectedDate)) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedweekDay}</span>
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

            {morningAppointments.map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hourFormatted}
                  </span>
                  <div>
                    <img src={appointment.user.avatar_url} alt={appointment.user.name}/>
                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
            ))}

          </Section>
          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hourFormatted}
                  </span>
                  <div>
                    <img src={appointment.user.avatar_url} alt={appointment.user.name}/>
                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
            ))}

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
