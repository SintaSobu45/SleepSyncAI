
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["SleepSyncAI.Api.csproj", "./"]
RUN dotnet restore "SleepSyncAI.Api.csproj"

COPY . .
RUN dotnet publish "SleepSyncAI.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SleepSyncAI.Api.dll"]
