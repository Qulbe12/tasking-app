interface ITime {
    time: number
    timezone: string
}

interface ITimespan {
    start_time: number
    end_time: number
    start_timezone: string | null
    end_timezone: string | null
}

interface IDatespan {
    start_date: string
    end_date: string
}

interface IWhen {
    time: ITime
    timespan: ITimespan
    date: string
    datespan: IDatespan
}

interface IEmail {
    type: string
    minutes_before_event: string
    body: string
    subject: string
}

interface IWebhooks {
    type: string
    minutes_before_event: string
    payload: string
    url: string
}

interface IParticipant {
    name: string | null
    email: string
    status: string
    comment: string | null
    phone_number: string | null
}

interface IRecurrence {
    rrule: string[]
    timezone: string
}

export interface IEventCreate {
    title: string | null
    busy: boolean
    visibility: string
    description: string
    when?: IWhen
    location: string
    reminder_minutes?: string
    reminder_method?: "email"
    metadata?: Record<string, string>
    notifications?: [IEmail, IWebhooks]
    hide_participants?: boolean
    participants?: IParticipant[]
    recurrence?: IRecurrence
    calendar_id: string
    round_robin_order?: string[]
    customer_event_id?: string
}
