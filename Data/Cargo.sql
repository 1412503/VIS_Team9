use BDTT
go

--service = 1 is rcs
insert into Cargo_Statistic(Service, Duration)
(select  1 as Service, (c.i1_rcs_p - c.i1_rcs_p) as Duration
from Cargo c
where i1_rcs_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration)
(select  1 as Service, (c.i2_rcs_p - c.i2_rcs_p) as Duration
from Cargo c
where i2_rcs_p is not null) 
go
insert into Cargo_Statistic(Service, Duration)
(select  1 as Service, (c.i3_rcs_p - c.i3_rcs_p) as Duration
from Cargo c
where i3_rcs_p is not null) 
go
insert into Cargo_Statistic(Service, Duration)
(select  1 as Service, (c.o_rcs_e - c.o_rcs_p) as Duration
from Cargo c
where o_rcs_p is not null) 
go

--service = 2 is dep
	--i1
insert into Cargo_Statistic(Service, Duration, Place)
(select 2 as Service, (c.i1_dep_1_e - c.i1_dep_1_p) as Duration, c.i1_dep_1_place as Place
from Cargo c
where c.i1_dep_1_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 2 as Service, (c.i1_dep_2_e - c.i1_dep_2_p) as Duration, c.i1_dep_2_place as Place
from Cargo c
where c.i1_dep_2_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 2 as Service, (c.i1_dep_3_e - c.i1_dep_3_p) as Duration, c.i1_dep_3_place as Place
from Cargo c
where c.i1_dep_3_p is not null
) 
go
	--i2
insert into Cargo_Statistic(Service, Duration, Place)
(select 2 as Service, (c.i2_dep_1_e - c.i2_dep_1_p) as Duration, c.i2_dep_1_place as Place
from Cargo c
where c.i2_dep_1_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 2 as Service, (c.i2_dep_2_e - c.i2_dep_2_p) as Duration, c.i2_dep_2_place as Place
from Cargo c
where c.i2_dep_2_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 2 as Service, (c.i2_dep_3_e - c.i2_dep_3_p) as Duration, c.i2_dep_3_place as Place
from Cargo c
where c.i2_dep_3_p is not null
) 
go
	--i3
insert into Cargo_Statistic(Service, Duration, Place)
(select 2 as Service, (c.i3_dep_1_e - c.i3_dep_1_p) as Duration, c.i3_dep_1_place as Place
from Cargo c
where c.i3_dep_1_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 2 as Service, (c.i3_dep_2_e - c.i3_dep_2_p) as Duration, c.i3_dep_2_place as Place
from Cargo c
where c.i3_dep_2_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 2 as Service, (c.i3_dep_3_e - c.i3_dep_3_p) as Duration, c.i3_dep_3_place as Place
from Cargo c
where c.i3_dep_3_p is not null
) 
go
	-- o
insert into Cargo_Statistic(Service, Duration, Place)
(select 2 as Service, (c.o_dep_1_e - c.o_dep_1_p) as Duration, c.o_dep_1_place as Place
from Cargo c
where c.o_dep_1_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 2 as Service, (c.o_dep_2_e - c.o_dep_2_p) as Duration, c.o_dep_2_place as Place
from Cargo c
where c.o_dep_2_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 2 as Service, (c.o_dep_3_e - c.o_dep_3_p) as Duration, c.o_dep_3_place as Place
from Cargo c
where c.o_dep_3_p is not null
) 
go


--service = 3 is rcf
	--i1
insert into Cargo_Statistic(Service, Duration, Place)
(select 3 as Service, (c.i1_rcf_1_e - c.i1_rcf_1_p) as Duration, c.i1_rcf_1_place as Place
from Cargo c
where c.i1_rcf_1_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 3 as Service, (c.i1_rcf_2_e - c.i1_rcf_2_p) as Duration, c.i1_rcf_2_place as Place
from Cargo c
where c.i1_rcf_2_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 3 as Service, (c.i1_rcf_3_e - c.i1_rcf_3_p) as Duration, c.i1_rcf_3_place as Place
from Cargo c
where c.i1_rcf_3_p is not null
) 
go
	--i2
insert into Cargo_Statistic(Service, Duration, Place)
(select 3 as Service, (c.i2_rcf_1_e - c.i2_rcf_1_p) as Duration, c.i2_rcf_1_place as Place
from Cargo c
where c.i2_rcf_1_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 3 as Service, (c.i2_rcf_2_e - c.i2_rcf_2_p) as Duration, c.i2_rcf_2_place as Place
from Cargo c
where c.i2_rcf_2_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 3 as Service, (c.i2_rcf_3_e - c.i2_rcf_3_p) as Duration, c.i2_rcf_3_place as Place
from Cargo c
where c.i2_rcf_3_p is not null
) 
go
	--i3
insert into Cargo_Statistic(Service, Duration, Place)
(select 3 as Service, (c.i3_rcf_1_e - c.i3_rcf_1_p) as Duration, c.i3_rcf_1_place as Place
from Cargo c
where c.i3_rcf_1_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 3 as Service, (c.i3_rcf_2_e - c.i3_rcf_2_p) as Duration, c.i3_rcf_2_place as Place
from Cargo c
where c.i3_rcf_2_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 3 as Service, (c.i3_rcf_3_e - c.i3_rcf_3_p) as Duration, c.i3_rcf_3_place as Place
from Cargo c
where c.i3_rcf_3_p is not null
) 
go
	--o
insert into Cargo_Statistic(Service, Duration, Place)
(select 3 as Service, (c.o_rcf_1_e - c.o_rcf_1_p) as Duration, c.o_rcf_1_place as Place
from Cargo c
where c.o_rcf_1_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 3 as Service, (c.o_rcf_2_e - c.o_rcf_2_p) as Duration, c.o_rcf_2_place as Place
from Cargo c
where c.o_rcf_2_p is not null
) 
go
insert into Cargo_Statistic(Service, Duration, Place)
(select 3 as Service, (c.o_rcf_3_e - c.o_rcf_3_p) as Duration, c.o_rcf_3_place as Place
from Cargo c
where c.o_rcf_3_p is not null
) 
go

--service = 4 is dlv
insert into Cargo_Statistic(Service, Duration)
(select 4 as Service, (c.i1_dlv_e - c.i1_dlv_p) as Duration
from Cargo c
where c.i1_dlv_p is not null) 
go
insert into Cargo_Statistic(Service, Duration)
(select 4 as Service, (c.i2_dlv_e - c.i2_dlv_p) as Duration
from Cargo c
where c.i2_dlv_p is not null) 
go
insert into Cargo_Statistic(Service, Duration)
(select 4 as Service, (c.i3_dlv_e - c.i3_dlv_p) as Duration
from Cargo c
where c.i3_dlv_p is not null) 
go
insert into Cargo_Statistic(Service, Duration)
(select 4 as Service, (c.o_dlv_e - c.o_dlv_p) as Duration
from Cargo c
where c.o_dlv_p is not null) 
go

--service = 0 is all
insert into Cargo_Statistic(Service, Duration)
(select 0 as Service, ( ISNULL(c.i1_rcs_e, 0) + ISNULL(c.i1_dep_1_e, 0) + ISNULL(c.i1_dep_2_e, 0) + ISNULL(c.i1_dep_3_e, 0) + ISNULL(c.i1_rcf_1_e, 0) + ISNULL(c.i1_rcf_2_e, 0) + ISNULL(c.i1_rcf_3_e, 0) + ISNULL(c.i1_dlv_e, 0) +
						ISNULL(c.i2_rcs_e, 0) + ISNULL(c.i2_dep_1_e, 0) + ISNULL(c.i2_dep_2_e, 0) + ISNULL(c.i2_dep_3_e, 0)+ ISNULL(c.i2_rcf_1_e, 0) + ISNULL(c.i2_rcf_2_e, 0) + ISNULL(c.i2_rcf_3_e, 0) + ISNULL(c.i2_dlv_e, 0) +
						ISNULL(c.i3_rcs_e, 0) + ISNULL(c.i3_dep_1_e, 0) + ISNULL(c.i3_dep_2_e, 0) + ISNULL(c.i3_dep_3_e, 0)+ ISNULL(c.i3_rcf_1_e, 0) + ISNULL(c.i3_rcf_2_e, 0) + ISNULL(c.i3_rcf_3_e, 0) + ISNULL(c.i3_dlv_e, 0) +
						ISNULL(c.o_rcs_e, 0) + ISNULL(c.o_dep_1_e, 0) + ISNULL(c.o_dep_2_e, 0) + ISNULL(c.o_dep_3_e, 0)+ ISNULL(c.o_rcf_1_e, 0) + ISNULL(c.o_rcf_2_e, 0) + ISNULL(c.o_rcf_3_e, 0) + ISNULL(c.o_dlv_e, 0)) 
					- (ISNULL(c.i1_rcs_p, 0) + ISNULL(c.i1_dep_1_p, 0) + ISNULL(c.i1_dep_2_p, 0) + ISNULL(c.i1_dep_3_p, 0) + ISNULL(c.i1_rcf_1_p, 0) + ISNULL(c.i1_rcf_2_p, 0) + ISNULL(c.i1_rcf_3_p, 0) + ISNULL(c.i1_dlv_p, 0) +
						ISNULL(c.i2_rcs_p, 0) + ISNULL(c.i2_dep_1_p, 0) + ISNULL(c.i2_dep_2_p, 0) + ISNULL(c.i2_dep_3_p, 0) + ISNULL(c.i2_rcf_1_p, 0) + ISNULL(c.i2_rcf_2_p, 0) + ISNULL(c.i2_rcf_3_p, 0) + ISNULL(c.i2_dlv_p, 0) +
						ISNULL(c.i3_rcs_p, 0) + ISNULL(c.i3_dep_1_p, 0) + ISNULL(c.i3_dep_2_p, 0) + ISNULL(c.i3_dep_3_p, 0) + ISNULL(c.i3_rcf_1_p, 0) + ISNULL(c.i3_rcf_2_p, 0) + ISNULL(c.i3_rcf_3_p, 0) + ISNULL(c.i3_dlv_p, 0) +
						ISNULL(c.o_rcs_p, 0) + ISNULL(c.o_dep_1_p, 0) + ISNULL(c.o_dep_2_p, 0) + ISNULL(c.o_dep_3_p, 0) + ISNULL(c.o_rcf_1_p, 0) + ISNULL(c.o_rcf_2_p, 0) + ISNULL(c.o_rcf_3_p, 0) + ISNULL(c.o_dlv_p, 0)) as Duration
from Cargo c) 


-- Add new column Status (1: Early, 2: OnTime, 3: Late)
update Cargo_Statistic 
set Status = case 
				when Duration > 0 then 1
				when Duration = 0 then 0
				else -1 
			end





