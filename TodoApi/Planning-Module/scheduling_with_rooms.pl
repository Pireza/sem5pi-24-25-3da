
:- dynamic availability/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:-dynamic agenda_operation_room/3.
:-dynamic agenda_operation_room1/3.
:-dynamic better_sol/5.


% Agenda dos membros do staff
agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).
agenda_staff(n001, 20241028, []).
agenda_staff(n002, 20241028, []).
%%
agenda_staff(d004, 20241028, []).
agenda_staff(n003, 20241028, []).
%
agenda_staff(t001, 20241028, []).
agenda_staff(t002, 20241028, []).



timetable(d001,20241028,(480,1200)).
timetable(d002,20241028,(500,1440)).
timetable(d003,20241028,(520,1320)).
timetable(n001, 20241028, (480, 1200)).
timetable(n002, 20241028, (480, 1200)).
%%
timetable(d004, 20241028, (480, 1200)).
timetable(n003, 20241028, (600, 1200)).
%%
timetable(t001, 20241028, (480, 1200)).
timetable(t002, 20241028, (480, 1200)).


% Staff responsável pela cirurgia
staff(d001,doctor,surgeon,[so2,so3,so4]).
staff(d002,doctor,surgeon,[so2,so3,so4]).
staff(d003,doctor,surgeon,[so2,so3,so4]).
staff(n001,nurse,surgeon,[so2,so3,so4]).
staff(n002,nurse,surgeon,[so2,so3,so4]).
% Staff responsável pela anestesia
staff(d004,doctor,anesthesia,[so2,so3,so4]).
staff(n003,nurse,anesthesia,[so2,so3,so4]).
% Staff responsável pela limpeza
staff(t001, assistant, cleaning, [so2,so3,so4]).
staff(t002, assistant, cleaning, [so2,so3,so4]).




%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).

surgery(so2,45,60,45).
surgery(so3,45,90,45).
surgery(so4,45,75,45).

surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).


assignment_surgery(so100001,d001).
assignment_surgery(so100001, n001).
assignment_surgery(so100001, d004).
assignment_surgery(so100001, t001).

assignment_surgery(so100002,d002).
assignment_surgery(so100002, n002).
assignment_surgery(so100002, n003).
assignment_surgery(so100002, t002).

assignment_surgery(so100003,d003).
assignment_surgery(so100003, n001).
assignment_surgery(so100003, d004).
assignment_surgery(so100003, t001).


agenda_operation_room(or1,20241028,[(520,579,so100000),(1000,1059,so099999)]).
agenda_operation_room(or2,20241028,[]).
agenda_operation_room(or3,20241028,[]).
agenda_operation_room(or4,20241028,[]).



schedule_surgeries_across_rooms(Rooms, Day) :-
    clean_dynamic_data,
    create_dynamic_data(Day),
    define_staff_availability,

    findall(OpCode, surgery_id(OpCode, _), LOpCode),
    distribute_surgeries(LOpCode, Rooms, Day),
    print_rooms_surgeries(Rooms, Day),
    !.


distribute_surgeries([], _, _).
distribute_surgeries([OpCode | Rest], Rooms, Day) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, TAnesthesia, TSurgery, TCleaning),

    % Find the room with the least number of surgeries and available for the operation
    find_least_crowded_room(Rooms, Day, Room),

    availability_operation(OpCode, Room, Day, Interval, LDoctorsSurgery, LStaffAnesthesia, LStaffCleaning),

    % Calculate surgery intervals
    calculate_intervals(Interval, TAnesthesia, TSurgery, TCleaning, MinuteStartAnesthesia, MinuteStartSurgery, 
    MinuteStartCleaning, MinuteEndProcess),

    % Update the agenda for the room with the scheduled surgery
    retract(agenda_operation_room1(Room, Day, Agenda)),
    insert_agenda((MinuteStartAnesthesia, MinuteEndProcess, OpCode), Agenda, UpdatedAgenda),
    assertz(agenda_operation_room1(Room, Day, UpdatedAgenda)),

    % Update staff agendas for the scheduled surgery
    insert_agenda_staff((MinuteStartSurgery, MinuteStartCleaning, OpCode), Day, LDoctorsSurgery),
    insert_agenda_staff((MinuteStartAnesthesia, MinuteStartCleaning, OpCode), Day, LStaffAnesthesia),
    insert_agenda_staff((MinuteStartCleaning, MinuteEndProcess, OpCode), Day, LStaffCleaning),

    % Update the better_sol dynamic data with the room and surgery details
    assertz(better_sol(OpCode, Room, Day, MinuteStartAnesthesia, MinuteEndProcess)),

    % Continue scheduling for the remaining surgeries
    distribute_surgeries(Rest, Rooms, Day).



% find_least_crowded_room(+Rooms, +Day, -Room)
% Finds the room with the least number of surgeries already scheduled.
find_least_crowded_room([Room], _, Room).
find_least_crowded_room([Room1, Room2 | Rest], Day, ChosenRoom) :-
    agenda_operation_room1(Room1, Day, Agenda1),
    agenda_operation_room1(Room2, Day, Agenda2),

    length(Agenda1, Count1),
    length(Agenda2, Count2),

    (Count1 =< Count2 -> find_least_crowded_room([Room1 | Rest], Day, ChosenRoom) ; 
    find_least_crowded_room([Room2 | Rest], Day, ChosenRoom)).

% print_rooms_surgeries(+Rooms, +Day)
% Prints the surgeries scheduled in each room for the given day.
print_rooms_surgeries([], _).
print_rooms_surgeries([Room | Rest], Day) :-
    agenda_operation_room1(Room, Day, Agenda),
    format('Room ~w: ~w~n', [Room, Agenda]),
    print_rooms_surgeries(Rest, Day).








free_agenda0([],[(0,1440)]).
free_agenda0([(0,Tfin,_)|LT],LT1):-!,free_agenda1([(0,Tfin,_)|LT],LT1).
free_agenda0([(Tin,Tfin,_)|LT],[(0,T1)|LT1]):- T1 is Tin-1,
    free_agenda1([(Tin,Tfin,_)|LT],LT1).

free_agenda1([(_,Tfin,_)],[(T1,1440)]):-Tfin\==1440,!,T1 is Tfin+1.
free_agenda1([(_,_,_)],[]).
free_agenda1([(_,T,_),(T1,Tfin2,_)|LT],LT1):-Tx is T+1,T1==Tx,!,
    free_agenda1([(T1,Tfin2,_)|LT],LT1).
free_agenda1([(_,Tfin1,_),(Tin2,Tfin2,_)|LT],[(T1,T2)|LT1]):-T1 is Tfin1+1,T2 is Tin2-1,
    free_agenda1([(Tin2,Tfin2,_)|LT],LT1).


adapt_timetable(D,Date,LFA,LFA2):-timetable(D,Date,(InTime,FinTime)),treatin(InTime,LFA,LFA1),treatfin(FinTime,LFA1,LFA2).

treatin(InTime,[(In,Fin)|LFA],[(In,Fin)|LFA]):-InTime=<In,!.
treatin(InTime,[(_,Fin)|LFA],LFA1):-InTime>Fin,!,treatin(InTime,LFA,LFA1).
treatin(InTime,[(_,Fin)|LFA],[(InTime,Fin)|LFA]).
treatin(_,[],[]).

treatfin(FinTime,[(In,Fin)|LFA],[(In,Fin)|LFA1]):-FinTime>=Fin,!,treatfin(FinTime,LFA,LFA1).
treatfin(FinTime,[(In,_)|_],[]):-FinTime=<In,!.
treatfin(FinTime,[(In,_)|_],[(In,FinTime)]).
treatfin(_,[],[]).


intersect_all_agendas([Name],Date,LA):-!,availability(Name,Date,LA).
intersect_all_agendas([Name|LNames],Date,LI):-
    availability(Name,Date,LA),
    intersect_all_agendas(LNames,Date,LI1),
    intersect_2_agendas(LA,LI1,LI).

intersect_2_agendas([],_,[]).
intersect_2_agendas([D|LD],LA,LIT):-	intersect_availability(D,LA,LI,LA1),
					intersect_2_agendas(LD,LA1,LID),
					append(LI,LID,LIT).

intersect_availability((_,_),[],[],[]).

intersect_availability((_,Fim),[(Ini1,Fim1)|LD],[],[(Ini1,Fim1)|LD]):-
		Fim<Ini1,!.

intersect_availability((Ini,Fim),[(_,Fim1)|LD],LI,LA):-
		Ini>Fim1,!,
		intersect_availability((Ini,Fim),LD,LI,LA).

intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)],[(Fim,Fim1)|LD]):-
		Fim1>Fim,!,
		min_max(Ini,Ini1,_,Imax),
		min_max(Fim,Fim1,Fmin,_).

intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)|LI],LA):-
		Fim>=Fim1,!,
		min_max(Ini,Ini1,_,Imax),
		min_max(Fim,Fim1,Fmin,_),
		intersect_availability((Fim1,Fim),LD,LI,LA).


min_max(I,I1,I,I1):- I<I1,!.
min_max(I,I1,I1,I).


% ========================================================

%%

schedule_all_surgeries(Room,Day):-
    clean_dynamic_data,
    create_dynamic_data(Day),
    define_staff_availability,

    findall(OpCode,surgery_id(OpCode,_),LOpCode),
    availability_all_surgeries(LOpCode,Room,Day),!.

%%

define_staff_availability() :- findall(_,(agenda_staff1(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_).


create_dynamic_data(Day) :-
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
    agenda_operation_room(Or,Date,Agenda),assert(agenda_operation_room1(Or,Date,Agenda)).


clean_dynamic_data():-
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)).


% ========================================================



availability_all_surgeries([],_,_).
availability_all_surgeries([OpCode|LOpCode],Room,Day):-

    surgery_id(OpCode,OpType) , surgery(OpType, TAnesthesia, TSurgery, TCleaning),
    availability_operation(OpCode, Room, Day, Interval, LDoctorsSurgery, LStaffAnesthesia, LStaffCleaning),
    calculate_intervals(Interval, TAnesthesia, TSurgery, TCleaning, MinuteStartAnesthesia, MinuteStartSurgery, MinuteStartCleaning, MinuteEndProcess),


    retract(agenda_operation_room1(Room,Day,Agenda)),
    insert_agenda((MinuteStartAnesthesia,MinuteEndProcess,OpCode),Agenda,Agenda1),
    assertz(agenda_operation_room1(Room,Day,Agenda1)),

    insert_agenda_staff((MinuteStartSurgery,MinuteStartCleaning,OpCode),Day,LDoctorsSurgery),
    insert_agenda_staff((MinuteStartAnesthesia,MinuteStartCleaning,OpCode),Day,LStaffAnesthesia),
    insert_agenda_staff((MinuteStartCleaning, MinuteEndProcess, OpCode), Day, LStaffCleaning),

    availability_all_surgeries(LOpCode,Room,Day).



% ========================================================


calculate_intervals((Start, End), TAnesthesia, TSurgery, TCleaning, MinuteStartAnesthesia, MinuteStartSurgery, MinuteStartCleaning, MinuteEndProcess) :-

    MinuteStartAnesthesia = Start,

    MinuteStartSurgery is MinuteStartAnesthesia + TAnesthesia,
    MinuteStartCleaning is MinuteStartSurgery + TSurgery,
    MinuteEndProcess is MinuteStartCleaning + TCleaning,

    MinuteEndProcess =< End.


%%
availability_operation(OpCode,Room,Day,Interval,LDoctorsSurgery,LStaffAnesthesia, LStaffCleaning):-
    surgery_id(OpCode, OpType) , surgery(OpType, TAnesthesia, TSurgery, TCleaning),
    findall(Staff, (assignment_surgery(OpCode, Staff) , staff(Staff,_,surgeon,_)), LDoctorsSurgery),
    findall(Staff, (assignment_surgery(OpCode, Staff) , staff(Staff,_,anesthesia,_)), LStaffAnesthesia),
    findall(Staff, (assignment_surgery(OpCode, Staff) , staff(Staff,_,cleaning,_)), LStaffCleaning),

    intersect_all_agendas(LDoctorsSurgery, Day, LSurgery),
    intersect_all_agendas(LStaffAnesthesia, Day, LAnesthesia),
    intersect_all_agendas(LStaffCleaning, Day, LCleaning),

    agenda_operation_room1(Room, Day, LAgenda),
    free_agenda0(LAgenda, LFAgRoom),

    find_first_interval(LAnesthesia, LSurgery, LCleaning, LFAgRoom, TAnesthesia, TSurgery, TCleaning, Interval).

%%




find_first_interval(LAnesthesia, LSurgery, LCleaning, LFAgRoom, TAnesthesia, TSurgery, TCleaning, Interval) :-
    once(find_first0(LAnesthesia, LSurgery, LCleaning, LFAgRoom, TAnesthesia, TSurgery, TCleaning, Interval)).


find_first0(LAnesthesia, LSurgery, LCleaning, RoomsAvailable, TAnesthesia, TSurgery, TCleaning, Interval) :-
    member((RoomStart, RoomEnd), RoomsAvailable),

    TotalTime is TAnesthesia + TSurgery + TCleaning,
    MaxStart is RoomEnd - TotalTime,
    between(RoomStart, MaxStart, StartAnesthesia),

    StartAnesthesia + TAnesthesia + TSurgery + TCleaning =< 1400,
    StartSurgery is StartAnesthesia + TAnesthesia,
    StartCleaning is StartSurgery + TSurgery,

    member((AnesthesiaStart,AnesthesiaEnd), LAnesthesia),
    AnesthesiaStart =< StartAnesthesia,
    AnesthesiaEnd >= (StartAnesthesia + TAnesthesia + TSurgery),

    member((SurgeryStart, SurgeryEnd), LSurgery),
    SurgeryStart =< StartSurgery,
    SurgeryEnd >= (StartSurgery + TSurgery),

    member((CleaningStart, CleaningEnd), LCleaning),
    CleaningStart =< StartCleaning,
    CleaningEnd >= (StartCleaning + TCleaning),

    RoomStart =< StartAnesthesia,
    RoomEnd >= (StartAnesthesia + TAnesthesia + TSurgery + TCleaning),

    EndProcess is StartAnesthesia + TAnesthesia + TSurgery + TCleaning,

    Interval = (StartAnesthesia, EndProcess).

%%

% ========================================================

remove_unf_intervals(_,[],[]).
remove_unf_intervals(TSurgery,[(Tin,Tfin)|LA],[(Tin,Tfin)|LA1]):-DT is Tfin-Tin+1,TSurgery=<DT,!,
    remove_unf_intervals(TSurgery,LA,LA1).
remove_unf_intervals(TSurgery,[_|LA],LA1):- remove_unf_intervals(TSurgery,LA,LA1).

% ========================================================



% schedule_first_interval(TSurgery, LPossibilites, (Tin, TfinS))

schedule_first_interval(TSurgery,[(Tin,_)|_],(Tin,TfinS)):-
    TfinS is Tin + TSurgery - 1.



insert_agenda((TinS,TfinS,OpCode),[],[(TinS,TfinS,OpCode)]).
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(TinS,TfinS,OpCode),(Tin,Tfin,OpCode1)|LA]):-TfinS<Tin,!.
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(Tin,Tfin,OpCode1)|LA1]):-insert_agenda((TinS,TfinS,OpCode),LA,LA1).



% ==========================================================================

insert_agenda_staff(_,_,[]).
insert_agenda_staff((TinS,TfinS,OpCode),Day,[Doctor|LDoctors]):-
    retract(agenda_staff1(Doctor,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assert(agenda_staff1(Doctor,Day,Agenda1)),
    insert_agenda_staff((TinS,TfinS,OpCode),Day,LDoctors).
